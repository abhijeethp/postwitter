/**
 * Proceed to next function in callback chain if user is not logged in.
 *
 * @throws {Error} throw error if a user is currently logged in
 */
function proceedIfNotLoggedIn(req, res, next) {
  req.session.user ? next(Error("ALREADY_LOGGED_IN")) : next();
}

/**
 * Proceed to next function in callback chain if user is authenticated and logged in.
 *
 * @throws {Error} throw error if no user is currently logged in
 */
function proceedIfLoggedIn(req, res, next) {
  !req.session.user ? next(Error("NOT_LOGGED_IN")) : next();
}

module.exports = { proceedIfLoggedIn, proceedIfNotLoggedIn };
