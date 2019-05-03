let chai = require("chai");
let expect = chai.expect;
var sinon = require("sinon");
chai.should();
const errorHandler = require("../../middleware/errorHandler");

module.exports = function() {
  it("it should return custom error message and status for handled errors", done => {
    const res = {
      status: function(code) {
        code.should.be.eql(403);
        return this;
      },
      send: sinon.spy()
    };
    errorHandler(Error("ALREADY_LOGGED_IN"), null, res, null);
    expect(res.send.calledOnce).to.be.true;
    res.send.getCall(0).args.length.should.be.eql(1);
    res.send.getCall(0).args[0].should.be.eql("Error : ALREADY_LOGGED_IN");
    done();
  });

  it("it should return default error message and status for unhandled errors", done => {
    const res = {
      status: function(code) {
        code.should.be.eql(501);
        return this;
      },
      send: sinon.spy()
    };
    errorHandler(Error("SOME_OTHER_ERROR"), null, res, null);
    expect(res.send.calledOnce).to.be.true;
    res.send.getCall(0).args.length.should.be.eql(1);
    res.send
      .getCall(0)
      .args[0].should.be.eql("TODO handle : Error : SOME_OTHER_ERROR");
    done();
  });
};
