let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../../app");
const agent = chai.request.agent(app);
const db = require("../../models");
chai.use(chaiHttp);
chai.should();

module.exports = function() {
  before(done => {
    db.User.destroy({
      where: {}
    }).then(() => done());
  });

  beforeEach(done => {
    agent.post("/logout").end(() => done());
  });
  /**
   * HOME ROUTE (test for no reason :D)
   */
  describe("GET / -> home route", () => {
    it("it should return greeting message", done => {
      agent.get("/").end((err, res) => {
        res.should.have.status(200);
        res.should.have.property("text");
        res.text.should.eql("WELCOME TO POSTWITTER");
        done();
      });
    });
  });

  /**
   * REGISTER ROUTE
   */
  describe("POST /register -> register route", () => {
    it("it should create a user and return the newly created user", done => {
      let user = {
        email: "alpha@user.com",
        displayName: "User Alpha",
        username: "userAlpha",
        password: "PasswordAlpha1"
      };
      agent
        .post("/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("id");
          res.body.id.should.be.a("number");
          res.body.should.have.property("email");
          res.body.email.should.be.eql(user.email);
          res.body.should.have.property("username");
          res.body.username.should.be.eql(user.username);
          res.body.should.have.property("displayName");
          res.body.displayName.should.be.eql(user.displayName);
          done();
        });
    });

    it("it should return an error when trying to register while logged in", done => {
      let user = {
        email: "beta@user.com",
        displayName: "User Beta",
        username: "userBeta",
        password: "PasswordBeta"
      };
      agent
        .post("/login")
        .send({ username: "userAlpha", password: "PasswordAlpha1" })
        .end((err, res) => {
          agent
            .post("/register")
            .send(user)
            .end((err, res) => {
              res.should.have.status(403);
              res.error.text.should.be.eql("Error : ALREADY_LOGGED_IN");
              done();
            });
        });
    });

    it("it should return an error becouse user with same email already exists", done => {
      let user = {
        email: "alpha@user.com",
        displayName: "User Alpha",
        username: "userDeltaAlpha",
        password: "PasswordAlpha1"
      };
      agent
        .post("/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(500);
          res.should.have.property("error");
          res.error.should.have.property("text");
          res.error.text.should.eql("Error : USER_WITH_EMAIL_ALREADY_EXISTS");
          done();
        });
    });

    it("it should return an error because user with same username already exists", done => {
      let user = {
        email: "beta@user.com",
        displayName: "User Alpha",
        username: "userAlpha",
        password: "PasswordAlpha1"
      };
      agent
        .post("/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(500);
          res.should.have.property("error");
          res.error.should.have.property("text");
          res.error.text.should.eql(
            "Error : USER_WITH_USERNAME_ALREADY_EXISTS"
          );
          done();
        });
    });

    it("it should return an error because email has invalid format", done => {
      let user = {
        email: "delta@something@user.com",
        displayName: "User Alpha",
        username: "deltaUser",
        password: "PasswordAlpha1"
      };
      agent
        .post("/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.have.property("error");
          res.error.should.have.property("text");
          res.error.text.should.eql("Error : INVALID_EMAIL");
          done();
        });
    });

    it("it should return an error because username has invalid format", done => {
      let user = {
        email: "beta@user.com",
        displayName: "User Beta",
        username: "Bet",
        password: "PasswordBeta1"
      };
      agent
        .post("/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.have.property("error");
          res.error.should.have.property("text");
          res.error.text.should.eql("Error : INVALID_USERNAME");
          done();
        });
    });

    it("it should return an error because password has invalid format", done => {
      let user = {
        email: "beta@user.com",
        displayName: "User Beta",
        username: "BetaUser",
        password: "PasswordBeta"
      };
      agent
        .post("/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.have.property("error");
          res.error.should.have.property("text");
          res.error.text.should.eql("Error : INVALID_PASSWORD");
          done();
        });
    });
  });

  /**
   * LOGIN ROUTE
   */
  describe("POST /login -> login route", () => {
    before(done => {
      let user = {
        email: "beta@user.com",
        displayName: "User Beta",
        username: "userBeta",
        password: "PasswordBeta1"
      };
      agent
        .post("/register")
        .send(user)
        .end(() => done());
    });

    it("it should throw an error if trying to log in while already logged in", done => {
      let credentials = {
        username: "beta@user.com",
        password: "PasswordBeta1"
      };
      agent
        .post("/login")
        .send(credentials)
        .end(() => {
          agent
            .post("/login")
            .send(credentials)
            .end((err, res) => {
              res.should.have.status(403);
              res.error.text.should.be.eql("Error : ALREADY_LOGGED_IN");
              done();
            });
        });
    });

    it("it should login a pre-existing user using email", done => {
      let credentials = {
        username: "beta@user.com",
        password: "PasswordBeta1"
      };
      agent
        .post("/login")
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("email");
          res.body.should.have.property("id");
          res.body.should.have.property("username");
          res.body.should.have.property("displayName");
          done();
        });
    });

    it("it should login a pre-existing user using username", done => {
      let credentials = {
        username: "userBeta",
        password: "PasswordBeta1"
      };
      agent
        .post("/login")
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("email");
          res.body.should.have.property("id");
          res.body.should.have.property("username");
          res.body.should.have.property("displayName");
          done();
        });
    });

    it("it should return an error because password is incorrect", done => {
      let credentials = {
        username: "beta@user.com",
        password: "PasswordAlpha1"
      };
      agent
        .post("/login")
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(403);
          res.should.have.property("error");
          res.error.should.have.property("text");
          res.error.text.should.eql("Error : INCORRECT_PASSWORD");
          done();
        });
    });

    it("it should return an error because password has wrong format", done => {
      let credentials = {
        username: "beta@user.com",
        password: "PasswordBeta"
      };
      agent
        .post("/login")
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.have.property("error");
          res.error.should.have.property("text");
          res.error.text.should.eql("Error : INVALID_PASSWORD");
          done();
        });
    });

    it("it should return an error because password has wrong format", done => {
      let credentials = {
        username: "userBeta",
        password: "PasswordBeta"
      };
      agent
        .post("/login")
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.have.property("error");
          res.error.should.have.property("text");
          res.error.text.should.eql("Error : INVALID_PASSWORD");
          done();
        });
    });

    it("it should return an error because username (or) email has wrong format", done => {
      let credentials = {
        username: "usa",
        password: "PasswordBeta"
      };
      agent
        .post("/login")
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(403);
          res.should.have.property("error");
          res.error.should.have.property("text");
          res.error.text.should.eql("Error : INVALID_USERNAME_OR_EMAIL");
          done();
        });
    });
  });

  /**
   * LOGOUT ROUTE
   */
  describe("GET /logout -> logout route ", () => {
    it("it should logout of the application if a user is currently logged in", done => {
      let user = {
        email: "logout@user.com",
        displayName: "User Logout",
        username: "userLogout",
        password: "PasswordLogout1"
      };
      agent
        .post("/register")
        .send(user)
        .end(() => {
          agent.post("/logout").end((err, res) => {
            res.should.have.status(200);
            res.text.should.be.eql("LOGGED_OUT_SUCCESSFULLY");
            done();
          });
        });
    });

    it("it should return an error if no user is logged in", done => {
      agent.post("/logout").end((err, res) => {
        res.should.have.status(401);
        res.error.text.should.eql("Error : NOT_LOGGED_IN");
        done();
      });
    });
  });

  /**
   * ME ROUTE
   */
  describe("GET /me -> me route ", () => {
    it("it should return an error if no user is logged in", done => {
      agent.get("/me").end((err, res) => {
        res.should.have.status(401);
        res.error.text.should.eql("Error : NOT_LOGGED_IN");
        done();
      });
    });

    it("it should return currently logged in user ", done => {
      let user = {
        email: "me@user.com",
        displayName: "User Me",
        username: "userMe",
        password: "PasswordMe1"
      };
      agent
        .post("/register")
        .send(user)
        .end(() => {
          agent.get("/me").end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.id.should.be.a("number");
            res.body.should.have.property("email");
            res.body.email.should.be.eql(user.email);
            res.body.should.have.property("displayName");
            res.body.displayName.should.be.eql(user.displayName);
            res.body.should.have.property("username");
            res.body.username.should.be.eql(user.username);
            done();
          });
        });
    });
  });
};
