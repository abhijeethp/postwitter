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
  ALREADY_LOGGED_IN: 400,
  NOT_LOGGED_IN: 401,
  INVALID_USERNAME: 400,
  INVALID_PASSWORD: 400,
  INVALID_EMAIL: 400,
  INCORRECT_PASSWORD: 403,
  INVALID_USERNAME_OR_EMAIL: 403,
  USER_WITH_USERNAME_ALREADY_EXISTS: 500,
  USER_WITH_EMAIL_ALREADY_EXISTS: 500,
  USER_DOES_NOT_EXIST: 403
};
