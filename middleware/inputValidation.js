/**
 * VALIDATE REGISTER INPUTS
 *
 * @description Middleware to check if all inputs given by the
 * client required for registration of user are valid.
 *
 * @throws {Error} Will throw error if email has invalid format
 * @throws {Error} Will throw error if username has invalid format
 * @throws {Error} Will throw error if password has invalid format
 */
function validateRegisterInputs(req, res, next) {
  isValidEmail(req.body.email)
    ? isValidPassword(req.body.password)
      ? isValidUsername(req.body.username)
        ? next()
        : next(new Error("INVALID_USERNAME"))
      : next(new Error("INVALID_PASSWORD"))
    : next(new Error("INVALID_EMAIL"));
}

/**
 * VALIDATE LOGIN INPUTS
 *
 * @description Middleware to check if all inputs given by the
 * client required for user login are valid.
 *
 * @throws {Error} Will throw error if username or email has invalid format
 * @throws {Error} Will throw error if password has invalid format
 */
function validateLoginInputs(req, res, next) {
  isValidEmail(req.body.username) || isValidUsername(req.body.username)
    ? isValidPassword(req.body.password)
      ? next()
      : next(new Error("INVALID_PASSWORD"))
    : next(new Error("INVALID_USERNAME_OR_EMAIL"));
}

/**
 * VALIDATE TWEET INPUTS
 *
 * @description Middleware to check if all inputs given
 * by the client to create a tweet are valid
 *
 * @throws {Error} Will throw error if username or email has invalid format
 * @throws {Error} Will throw error if password has invalid format
 */
function validateTweetInputs(req, res, next) {
  isValidTweetText(req.body.text)
    ? next()
    : next(new Error("INVALID_TWEET_TEXT"));
}

/**
 * VALIDATE EMAIL (Utility function)
 *
 * @description Validates an email based on regexp to check if email
 * is of form <ADDR>@<DOMAIN>. Ex : Jhon.smith@alpha.net.
 *
 * @param {string} email
 *
 * @returns {boolean} if email format is valid
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * VALIDATE PASSWORD (Utility function)
 *
 * @description Validates a password based on regexp to check if password is between 6 to 20
 * and has atleast one numeric digit, one uppercase letter and one lowercase letter
 *
 * @param {string} password
 *
 * @returns {boolean} if password format is valid
 */
function isValidPassword(password) {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password);
}

/**
 * VALIDATE USERNAME (Utility function)
 *
 * @description Validates a username based on regexp to check if username is between
 * 6 to 20 characters and contains only alpha-numeric characters.
 *
 * @param {string} username
 *
 * @returns {boolean} if username format is valid
 */
function isValidUsername(username) {
  return /^([a-zA-Z0-9_-]){6,20}$/.test(username);
}

/**
 * VALIDATE TWEET TEXT (Utility function)
 *
 * @description Validates the text content of a tweet based on regexp to check if text
 * is between 5 to 200 characters and contains only alpha-numeric characters.
 *
 * @param {string} tweetText Text content of tweet
 *
 * @returns {boolean} if username format is valid
 */
function isValidTweetText(tweetText) {
  return tweetText.length >= 5 && tweetText.length <= 200;
}

module.exports = {
  validateRegisterInputs,
  validateLoginInputs,
  validateTweetInputs
};
