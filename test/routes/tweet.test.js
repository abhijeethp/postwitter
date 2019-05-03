let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../../app");
const agent = chai.request.agent(app);
const db = require("../../models");
chai.use(chaiHttp);
chai.should();

module.exports = function() {
  before(done => {
    let user = {
      email: "tweetTest@user.com",
      displayName: "User Tweet Test",
      username: "userTweetTest",
      password: "PasswordTweet69"
    };
    db.User.destroy({ where: {} }).then(() => {
      agent
        .post("/register")
        .send(user)
        .end(() => done());
    });
  });

  beforeEach(done => {
    agent.post("/logout").end(() => done());
  });

  /**
   * INDEX ROUTE TEST
   */
  describe("GET /tweet -> index route", () => {
    it("it should return a error as no user is currently logged in", done => {
      agent.get("/tweet").end((err, res) => {
        res.should.have.status(401);
        res.error.text.should.be.eql("Error : NOT_LOGGED_IN");
        done();
      });
    });

    it("it should return list of tweets for currently logged in user", done => {
      agent
        .post("/login")
        .send({ username: "userTweetTest", password: "PasswordTweet69" })
        .end((err, res) => {
          agent.get("/tweet").end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
          });
        });
    });

    it("it should return list of tweets for currently logged in user", done => {
      agent
        .post("/login")
        .send({ username: "userTweetTest", password: "PasswordTweet69" })
        .end((err, res) => {
          agent
            .post("/tweet")
            .send({ text: "#ROBB_STARK" })
            .end((err, res) => {
              agent.get("/tweet").end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("array");
                res.body.length.should.eql(1);
                res.body[0].should.have.property("text");
                res.body[0].text.should.be.eql("#ROBB_STARK");
                done();
              });
            });
        });
    });
  });

  /**
   * CREATE ROUTE TEST
   */
  describe("POST /tweet -> create route", () => {
    it("it should return a error as no user is currently logged in", done => {
      agent.get("/tweet").end((err, res) => {
        res.should.have.status(401);
        res.error.text.should.be.eql("Error : NOT_LOGGED_IN");
        done();
      });
    });

    it("it should create a new tweet for currently logged in user", done => {
      agent
        .post("/login")
        .send({ username: "userTweetTest", password: "PasswordTweet69" })
        .end((err, res) => {
          var userId = res.body.id;
          agent
            .post("/tweet")
            .send({ text: "#CATELYN_STARK" })
            .end((err, res) => {
              res.should.have.status(201);
              res.body.should.have.property("id");
              res.body.should.have.property("text");
              res.body.should.have.property("tweeterId");
              res.body.tweeterId.should.be.eql(userId);
              done();
            });
        });
    });
  });

  /**
   * SHOW ROUTE TEST
   */
  describe("GET /tweet/:tweetId -> show route", () => {
    it("it should return a error as no user is currently logged in", done => {
      agent.get("/tweet").end((err, res) => {
        res.should.have.status(401);
        res.error.text.should.be.eql("Error : NOT_LOGGED_IN");
        done();
      });
    });

    it("it should return tweet by tweetId", done => {
      let tweet = {
        text: "#NED_STARK"
      };
      agent
        .post("/login")
        .send({ username: "userTweetTest", password: "PasswordTweet69" })
        .end((err, res) => {
          var userId = res.body.id;
          agent
            .post("/tweet")
            .send(tweet)
            .end((err, res) => {
              var tweetId = res.body.id;
              agent.get(`/tweet/${tweetId}`).end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("id");
                res.body.should.have.property("text");
                res.body.should.have.property("tweeter");
                res.body.tweeter.should.have.property("id");
                res.body.tweeter.id.should.be.eql(userId);
                done();
              });
            });
        });
    });

    it("it should throw error if tweet with id is not found", done => {
      agent
        .post("/login")
        .send({ username: "userTweetTest", password: "PasswordTweet69" })
        .end((err, res) => {
          agent.get(`/tweet/${-1}`).end((err, res) => {
            res.should.have.status(404);
            res.error.text.should.be.eql("Error : TWEET_DOES_NOT_EXIST");
            done();
          });
        });
    });
  });

  /**
   * DELETE ROUTE TEST
   */
  describe("DELETE /tweet/tweetId -> delete route", () => {
    it("it should return a error as no user is currently logged in", done => {
      agent.get("/tweet").end((err, res) => {
        res.should.have.status(401);
        res.error.text.should.be.eql("Error : NOT_LOGGED_IN");
        done();
      });
    });

    it("it should delete a tweet by tweetId", done => {
      let tweet = {
        text: "#CATELYN_STARK"
      };
      agent
        .post("/login")
        .send({ username: "userTweetTest", password: "PasswordTweet69" })
        .end((err, res) => {
          var userId = res.body.id;
          agent
            .post("/tweet")
            .send(tweet)
            .end((err, res) => {
              var tweetId = res.body.id;
              agent.delete(`/tweet/${tweetId}`).end((err, res) => {
                res.should.have.status(200);
                res.text.should.be.eql("SUCCESSFULLY_DELETED_TWEET");
                done();
              });
            });
        });
    });
  });
};
