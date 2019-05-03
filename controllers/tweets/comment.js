const Tweet = require("../../models").Tweet;
const Comment = require("../../models").Comment;

/**
 * CREATE -> comment controller
 *
 * @description creates a comment on a particular tweet
 *
 * @throws {Error} Will throw error if failed to comment on tweet
 */
function commentCreateController(req, res, next) {
  Tweet.findByPk(req.body.tweetId)
    .then(tweet => {
      if (!tweet) next(Error("TWEET_DOES_NOT_EXIST"));
      else {
        Comment.create({
          commenterId: req.session.user.id,
          text: req.body.text
        })
          .then(comment => {
            tweet
              .addComment(comment)
              .then(() => res.status(201).send(comment))
              .catch(err => next(Error("TWEET_COMMENT_ERROR")));
          })
          .catch(err => next(Error("COMMENT_CREATION_ERROR")));
      }
    })
    .catch(err => next(Error("TWEET_FETCH_ERROR")));
}

/**
 * CREATE -> reply controller
 *
 * creates a comment on a particular comment
 *
 * @throws {Error} Will throw error if failed to comment on comment
 */
function replyController(req, res, next) {
  return Comment.findByPk(req.body.commentId)
    .then(comment => {
      if (!comment) {
        next(Error("COMMENT_DOES_NOT_EXIST"));
      } else {
        Comment.create({
          commenterId: req.session.user.id,
          text: req.body.text
        })
          .then(reply => {
            comment
              .addChild(reply)
              .then(() => res.status(201).send(reply))
              .catch("COMMENT_REPLY_ERROR");
          })
          .catch(err => {
            next(Error("REPLY_CREATION_ERROR"));
          });
      }
    })
    .catch(err => {
      next(Error("COMMENT_FETCH_ERROR"));
    });
}

/**
 * SHOW -> comment controller
 *
 * @description returns a single comment
 *
 * @throws {Error} Will throw error if failed to comment on comment
 */
function commentShowController(req, res, next) {
  Comment.findByPk(req.params.commentId, {
    attributes: ["id", "text", "createdAt", "commenterId"],
    include: [
      {
        model: Comment,
        as: "descendents",
        hierarchy: true,
        attributes: ["id", "text", "createdAt", "commenterId", "parent_id"]
      }
    ]
  })
    .then(comment => {
      if (!comment) {
        next(Error("COMMENT_DOES_NOT_EXIST"));
      } else {
        res.status(200).send(comment);
      }
    })
    .catch(err => next(Error("COMMENT_FETCH_ERROR : " + err)));
}

module.exports = {
  commentCreateController,
  commentShowController,
  replyController
};
