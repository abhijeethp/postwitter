let chai = require("chai");
let expect = chai.expect;
var sinon = require("sinon");
chai.should();
let proceedIfNotLoggedIn = require("../../middleware/permissionHandler")
  .proceedIfNotLoggedIn;
let proceedIfLoggedIn = require("../../middleware/permissionHandler")
  .proceedIfLoggedIn;

module.exports = function() {
  /**
   * Test middleware function proceedIfNotLoggedIn
   */
  describe("PROCEED IF NOT LOGGED IN", () => {
    it("proceed with next function in express callback chain if not logged in", done => {
      let req = { session: {} };
      var spy = sinon.spy();
      proceedIfNotLoggedIn(req, null, spy);
      expect(spy.calledOnce).to.be.true;
      spy.getCall(0).args.length.should.be.eql(0);
      done();
    });

    it("throw error if logged in", done => {
      let req = { session: { user: { id: 1 } } };
      var spy = sinon.spy();
      proceedIfNotLoggedIn(req, null, spy);
      expect(spy.calledOnce).to.be.true;
      spy.getCall(0).args.length.should.be.eql(1);
      spy.getCall(0).args[0].should.be.an.instanceOf(Error);
      spy.getCall(0).args[0].message.should.be.eql("ALREADY_LOGGED_IN");
      done();
    });
  });

  /**
   * Test middleware function proceedIfLoggedIn
   */
  describe("PROCEED IF LOGGED IN", () => {
    it("proceed with next function in express callback chain if logged in", done => {
      let req = { session: { user: { id: 1 } } };
      var spy = sinon.spy();
      proceedIfLoggedIn(req, null, spy);
      expect(spy.calledOnce).to.be.true;
      spy.getCall(0).args.length.should.be.eql(0);
      done();
    });

    it("throw error if not logged in", done => {
      let req = { session: {} };
      var spy = sinon.spy();
      proceedIfLoggedIn(req, null, spy);
      expect(spy.calledOnce).to.be.true;
      spy.getCall(0).args.length.should.be.eql(1);
      spy.getCall(0).args[0].should.be.an.instanceOf(Error);
      spy.getCall(0).args[0].message.should.be.eql("NOT_LOGGED_IN");
      done();
    });
  });
};
