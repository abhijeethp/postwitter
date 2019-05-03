const chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const sinon = require("sinon");

const validateRegisterInputs = require("../../middleware/inputValidation")
  .validateRegisterInputs;
const validateLoginInputs = require("../../middleware/inputValidation")
  .validateLoginInputs;
const validateTweetInputs = require("../../middleware/inputValidation")
  .validateTweetInputs;

chai.should();

module.exports = function() {
  /**
   * Validate inputs sent to register route
   */
  describe("VALIDATE REGISTER INPUTS", () => {
    it("it should call next function in the callback chain if all inputs are valid", done => {
      let req = {
        body: {
          email: "jon@snow.com",
          password: "KnowNothing37",
          username: "AegonTarg"
        }
      };
      var spy = sinon.spy();
      validateRegisterInputs(req, null, spy);
      expect(spy.calledOnce).to.be.true;
      spy.getCall(0).args.length.should.be.eql(0);
      done();
    });
    it("it should throw error if email is of invalid format", done => {
      let req = {
        body: {
          email: "ramsey@snow@bolton.com",
          password: "KnowNothing37",
          username: "ReekIsBest"
        }
      };
      var spy = sinon.spy();
      validateRegisterInputs(req, null, spy);
      expect(spy.calledOnce).to.be.true;
      spy.getCall(0).args.length.should.be.eql(1);
      spy.getCall(0).args[0].should.be.an.instanceOf(Error);
      spy.getCall(0).args[0].message.should.be.eql("INVALID_EMAIL");
      done();
    });
    it("it should throw error if username is of invalid format", done => {
      let req = {
        body: {
          email: "jon@snow.com",
          password: "KnowNothing37",
          username: "-.-Hello"
        }
      };
      var spy = sinon.spy();
      validateRegisterInputs(req, null, spy);
      expect(spy.calledOnce).to.be.true;
      spy.getCall(0).args.length.should.be.eql(1);
      spy.getCall(0).args[0].should.be.an.instanceOf(Error);
      spy.getCall(0).args[0].message.should.be.eql("INVALID_USERNAME");
      done();
    });
    it("it should throw error if password is of invalid format", done => {
      let req = {
        body: {
          email: "jon@snow.com",
          password: "noNumber",
          username: "AegonTarg"
        }
      };
      var spy = sinon.spy();
      validateRegisterInputs(req, null, spy);
      expect(spy.calledOnce).to.be.true;
      spy.getCall(0).args.length.should.be.eql(1);
      spy.getCall(0).args[0].should.be.an.instanceOf(Error);
      spy.getCall(0).args[0].message.should.be.eql("INVALID_PASSWORD");
      done();
    });
  });

  /**
   * Validate inputs sent to login route
   */
  describe("VALIDATE LOGIN INPUTS", () => {
    it("it should call next function in the callback chain if all inputs are valid", done => {
      let req = {
        body: {
          username: "jon@snow.com",
          password: "KnowNothing37"
        }
      };
      var spy = sinon.spy();
      validateLoginInputs(req, null, spy);
      expect(spy.calledOnce).to.be.true;
      spy.getCall(0).args.length.should.be.eql(0);
      done();
    });

    it("it should throw error if email as username is of invalid format", done => {
      let req = {
        body: {
          username: "ramsey@snow@bolton.com",
          password: "KnowNothing37"
        }
      };
      var spy = sinon.spy();
      validateLoginInputs(req, null, spy);
      expect(spy.calledOnce).to.be.true;
      spy.getCall(0).args.length.should.be.eql(1);
      spy.getCall(0).args[0].should.be.an.instanceOf(Error);
      spy.getCall(0).args[0].message.should.be.eql("INVALID_USERNAME_OR_EMAIL");
      done();
    });

    it("it should throw error if username as username is of invalid format", done => {
      let req = {
        body: {
          username: "tony",
          password: "IronMan51"
        }
      };
      var spy = sinon.spy();
      validateLoginInputs(req, null, spy);
      expect(spy.calledOnce).to.be.true;
      spy.getCall(0).args.length.should.be.eql(1);
      spy.getCall(0).args[0].should.be.an.instanceOf(Error);
      spy.getCall(0).args[0].message.should.be.eql("INVALID_USERNAME_OR_EMAIL");
      done();
    });

    it("it should throw error if password is of invalid format", done => {
      let req = {
        body: {
          email: "professor@hulk.com",
          password: "#BRUCE"
        }
      };
      var spy = sinon.spy();
      validateLoginInputs(req, null, spy);
      expect(spy.calledOnce).to.be.true;
      spy.getCall(0).args.length.should.be.eql(1);
      spy.getCall(0).args[0].should.be.an.instanceOf(Error);
      spy.getCall(0).args[0].message.should.be.eql("INVALID_PASSWORD");
      done();
    });
  });

  /**
   * Validate inputs sent for creation of tweet
   */
  describe("VALIDATE TWEET INPUTS", () => {
    it("it should call next function in the callback chain if all inputs are valid", done => {
      let req = {
        body: {
          text: "#NEW_ASGARD"
        }
      };
      var spy = sinon.spy();
      validateTweetInputs(req, null, spy);
      expect(spy.calledOnce).to.be.true;
      spy.getCall(0).args.length.should.be.eql(0);
      done();
    });
    it("it should throw error if tweet text is of invalid format", done => {
      let req = {
        body: {
          text: "1"
        }
      };
      var spy = sinon.spy();
      validateTweetInputs(req, null, spy);
      expect(spy.calledOnce).to.be.true;
      spy.getCall(0).args.length.should.be.eql(1);
      spy.getCall(0).args[0].should.be.an.instanceOf(Error);
      spy.getCall(0).args[0].message.should.be.eql("INVALID_TWEET_TEXT");
      done();
    });
  });
};
