let chai = require("chai");
let chaiHttp = require("chai-http");
const db = require("../models");
chai.use(chaiHttp);

// Parent block
describe("Postwitter Tests", () => {
  // perform before start of all route tests
  before(done => {
    db.sequelize
      .sync({
        force: true
      })
      .then(() => done());
  });

  // Middleware tests
  describe("Middleware", () => {
    // error handler middleware tests
    describe("Error Handler", require("./middleware/errorHandler.test"));
    // input validation middleware tests
    describe("Input Validation", require("./middleware/inputValidation.test"));
    // permission handler middleware tests
    describe(
      "Permission Handler",
      require("./middleware/permissionHandler.test")
    );
  });

  // TODO - controllers tests
  describe("Controllers", () => {
    // users controller tests
    describe("Users Controller", require("./controllers/users.test"));
    // tweets controller tests
    describe("Tweets Controller", require("./controllers/tweets.test"));
  });

  // Routes tests
  describe("Routes", () => {
    // Index routes tests
    describe("Index", require("./routes/index.test"));

    // Tweet routes tests
    describe("Tweet", require("./routes/tweet.test"));

    // User routes tests
    describe("User", require("./routes/user.test"));
  });
});
