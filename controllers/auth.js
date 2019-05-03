const Tweet = require("../models").Tweet;
const User = require("../models").User;
const Op = require("sequelize").Op;
const bcrypt = require("bcrypt");

/**
 * REGISTER CONTROLLER
 *
 * @description Registers a new user. Creates a new user in the database
 * and logs the user into the application by setting session variables.
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
 * LOGIN CONTROLLER
 *
 * @description Logs a user into the application and
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
 * LOGOUT CONTROLLER.
 *
 * @description Logs a user out of the application by destroying session data for that user.
 */
function logout(req, res) {
  req.session.destroy();
  res.status(200).send("LOGGED_OUT_SUCCESSFULLY");
}

/**
 * ME CONTROLLER
 *
 * @description Returns current user logged into the application.
 * Optionally returns associated data.
 *
 * @throws {Error} Will throw error if application fails to fetch user from the database.
 */
function me(req, res, next) {
  userAttributes = ["id", "username", "displayName", "email", "createdAt"];
  tweetAttributes = ["id", "text", "createdAt"];
  userIncludes = [];
  if (req.query.tweets == "TRUE") {
    userIncludes.push({
      model: Tweet,
      attributes: tweetAttributes
    });
  }

  if (req.query.retweets == "TRUE")
    userIncludes.push({
      model: Tweet,
      as: "retweeted",
      attributes: tweetAttributes,
      through: { attributes: [] }
    });

  if (req.query.likes == "TRUE")
    userIncludes.push({
      model: Tweet,
      as: "liked",
      attributes: tweetAttributes,
      through: { attributes: [] }
    });

  if (req.query.followers == "TRUE")
    userIncludes.push({
      model: User,
      as: "followedBy",
      attributes: userAttributes,
      through: { attributes: [] }
    });

  if (req.query.following == "TRUE")
    userIncludes.push({
      model: User,
      as: "following",
      attributes: userAttributes,
      through: { attributes: [] }
    });

  User.findByPk(req.session.user.id, {
    attributes: userAttributes,
    include: userIncludes
  })
    .then(user => {
      res.status(200).send(user);
    })
    .catch(err => next(Error("USER_FETCH_ERROR" + err)));
}

module.exports = { register, login, logout, me };
