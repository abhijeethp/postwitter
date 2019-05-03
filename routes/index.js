const express = require("express");
const router = express.Router();

/**
 * HOME ROUTE
 *
 * @description returns a greeting message.
 */
router.get("/", function(req, res, next) {
  res.status(200).send("WELCOME TO POSTWITTER");
});

router.use("/", require("./auth"));
router.use("/user", require("./user"));
router.use("/tweet", require("./tweet"));

module.exports = router;
