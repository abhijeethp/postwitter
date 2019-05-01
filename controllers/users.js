const User = require("../models").User;
const Op = require("sequelize").Op;
const bcrypt = require("bcrypt");

/**
 * Register controller
 *
 * Registers a new user. Creates a new user in the database and logs
 * the user into the application by setting session variables.
 *
 * @throws {Error} Will throw error if user with given email already exists in the database
 * @throws {Error} Will throw error if user with given username already exists in the database
 * @throws {Error} will throw error if creation of user fails otherwise
 */
function register(req, res, next) {
  return User.create(req.body)
    .then(user => {
      req.session.user = {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        username: user.username
      };
      res.status(201).send(req.session.user);
    })
    .catch(err => {
      err.name === "SequelizeUniqueConstraintError"
        ? Object.keys(err.fields)[0] === "email"
          ? next(Error("USER_WITH_EMAIL_ALREADY_EXISTS"))
          : next(Error("USER_WITH_USERNAME_ALREADY_EXISTS"))
        : next(Error("USER_CREATION_ERROR"));
    });
}

/**
 * Login controller.
 *
 * Logs a user into the application and
 * sets session details after authentication.
 *
 * @throws {Error} Will throw error if encryption of password fails
 * @throws {Error} will throw error if password does not match
 * @throws {Error} will throw error if user with email or username does not exist in the database
 */
function login(req, res, next) {
  return User.findOne({
    where: {
      [Op.or]: [{ email: req.body.username }, { username: req.body.username }]
    }
  })
    .then(user => {
      bcrypt.compare(req.body.password, user.password, function(
        err,
        isAuthenticated
      ) {
        if (err) {
          next(Error("PASSWORD_ENCRYPTION_ERROR"));
        } else if (!isAuthenticated) {
          next(Error("INCORRECT_PASSWORD"));
        } else {
          req.session.user = {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            username: user.username
          };
          res.status(200).send(req.session.user);
        }
      });
    })
    .catch(error => {
      next(Error("USER_DOES_NOT_EXIST"));
    });
}

/**
 * Logout controller.
 *
 * Logs a user out of the application by destroying session data for that user.
 */
function logout(req, res) {
  req.session.destroy();
  res.status(200).send("LOGGED_OUT_SUCCESSFULLY");
}

/**
 * Me controller
 *
 * returns current user logged into the application.
 */
function me(req, res) {
  res.json(req.session.user);
}

/**
 * Follow controller
 *
 * makes current user follow another user
 */
function follow(req, res, next) {
  return User.findByPk(req.session.user.id)
    .then(follower => {
      User.findByPk(req.params.userId)
        .then(followed => {
          if (!followed) {
            next(new Error("USER_DOES_NOT_EXIST"));
          } else {
            follower
              .addFollower(followed)
              .then(res.status(200).send("SUCCESSFULLY_FOLLOWED"))
              .catch(err => next(new Error("USER_FOLLOW_ERROR : " + err)));
          }
        })
        .catch(err => next(new Error("USER_FETCH_ERROR" + err)));
    })
    .catch(err => next(new Error("USER_FETCH_ERROR" + err)));
}

/**
 * Unfollow controller
 *
 * makes current user Unfollow another user
 */
function unfollow(req, res, next) {
  return User.findByPk(req.session.user.id)
    .then(follower => {
      User.findByPk(req.params.userId)
        .then(followed => {
          if (!followed) {
            next(new Error("USER_DOES_NOT_EXIST"));
          } else {
            follower
              .removeFollower(followed)
              .then(res.status(200).send("SUCCESSFULLY_UNFOLLOWED"))
              .catch(err => next(new Error("USER_UNFOLLOW_ERROR : " + err)));
          }
        })
        .catch(err => next(new Error("USER_FETCH_ERROR" + err)));
    })
    .catch(err => next(new Error("USER_FETCH_ERROR" + err)));
}

module.exports = { register, login, logout, me, follow, unfollow };
