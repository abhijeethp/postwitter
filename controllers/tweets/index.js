const User = require("../../models").User;
const Tweet = require("../../models").Tweet;
const Comment = require("../../models").Comment;

const likeController = require("./like").likeController;
const unlikeController = require("./like").unlikeController;
const retweetController = require("./retweet").retweetController;
const unretweetController = require("./retweet").unretweetController;
const commentCreateController = require("./comment").commentCreateController;
const commentShowController = require("./comment").commentShowController;
const replyController = require("./comment").replyController;

/**
 * Index controller
 *
 * Returns a list of tweets made by currently logged in user
 *
 * @throws {Error} Will throw error failed to fetch tweets
 */
function indexController(req, res, next) {
  return Tweet.findAll({
    where: {
      tweeterId: req.session.user.id
    }
  })
    .then(tweets => {
      res.status(200).send(tweets);
    })
    .catch(err => {
      next(Error("ERROR_FETCHING_TWEETS"));
    });
}

/**
 * Create controller
 *
 * Creates a new tweet for currently logged in user
 *
 * @throws {Error} Will throw error failed to create tweet
 */
function createController(req, res, next) {
  return Tweet.create({
    text: req.body.text,
    tweeterId: req.session.user.id
  })
    .then(tweet => {
      res.status(201).send(tweet);
    })
    .catch(err => {
      next(Error("TWEET_CREATION_ERROR"));
    });
}

/**
 * Show controller
 *
 * @description Returns a particular tweet and its comment thread
 *
 * @throws {Error} Will throw error if failed to fetched tweet
 */
function showController(req, res, next) {
  return Tweet.findByPk(req.params.tweetId, {
    attributes: ["id", "text", "createdAt"],
    include: [
      {
        model: User,
        as: "tweeter",
        attributes: ["id", "displayName"]
      },
      {
        model: Comment,
        attributes: ["id", "text", "createdAt", "commenterId", "parent_id"],
        include: [
          {
            model: Comment,
            as: "descendents",
            hierarchy: true,
            attributes: ["id", "text", "createdAt", "commenterId", "parent_id"]
          }
        ]
      }
    ]
  })
    .then(tweet => {
      !tweet
        ? next(new Error("TWEET_DOES_NOT_EXIST"))
        : res.status(200).send(tweet);
    })
    .catch(err => {
      next(Error("ERROR_FETCHING_TWEET" + err));
    });
}

/**
 * Delete controller
 *
 * Deletes a particular tweet
 *
 * @throws {Error} Will throw error if failed to delete tweet
 */
function deleteController(req, res, next) {
  return Tweet.findByPk(req.params.tweetId)
    .then(tweet => {
      if (!tweet) next(new Error("TWEET_DOES_NOT_EXIST"));
      else {
        if (tweet.tweeterId !== req.session.user.id) {
          next(Error("CANNOT_DELETE_OTHER_USERS_TWEET"));
        } else {
          return tweet
            .destroy()
            .then(() => {
              res.status(200).send("SUCCESSFULLY_DELETED_TWEET");
            })
            .catch(err => {
              next(Error("ERROR_DELETING_TWEET"));
            });
        }
      }
    })
    .catch(err => {
      next(Error("ERROR_FETCHING_TWEET" + err));
    });
}

module.exports = {
  indexController,
  createController,
  showController,
  deleteController,
  likeController,
  unlikeController,
  retweetController,
  unretweetController,
  commentCreateController,
  commentShowController,
  replyController
};
