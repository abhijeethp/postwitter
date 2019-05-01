/**
 * Returns an error response to the client with
 * a message and the error respective response code.
 */
module.exports = function(err, req, res, next) {
  var message = "Error : " + err.message;
  var status = statusMap[err.message];
  status
    ? res.status(status).send(message)
    : res.status(501).send("TODO handle : " + message);
};

/**
 * Maps each error with it's http rsponse status.
 */
statusMap = {
  ALREADY_LOGGED_IN: 403,
  NOT_LOGGED_IN: 401,
  INVALID_USERNAME: 400,
  INVALID_PASSWORD: 400,
  INVALID_EMAIL: 400,
  INCORRECT_PASSWORD: 403,
  INVALID_USERNAME_OR_EMAIL: 403,
  USER_WITH_USERNAME_ALREADY_EXISTS: 500,
  USER_WITH_EMAIL_ALREADY_EXISTS: 500,
  USER_DOES_NOT_EXIST: 500,
  ERROR_FETCHING_TWEETS: 500,
  TWEET_CREATION_ERROR: 500,
  TWEET_DOES_NOT_EXIST: 500,
  ERROR_FETCHING_TWEET: 500,
  ERROR_DELETING_TWEET: 500,
  USER_FOLLOW_ERROR: 500,
  USER_FETCH_ERROR: 500,
  USER_UNFOLLOW_ERROR: 500,
  INVALID_TWEET_TEXT: 400,
  CANNOT_FOLLOW_YOURSELF: 403,
  CANNOT_UNFOLLOW_YOURSELF: 403
};
