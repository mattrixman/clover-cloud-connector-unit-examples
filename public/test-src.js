require("prototype");

var TestBase = require("./TestBase.js");
var TestSale = require("./TestSale.js");
var TestAuth = require("./TestAuth.js");
var TestPreAuth = require("./TestPreAuth.js");
var TestPreAuthCapture = require("./TestPreAuthCapture.js");

if ('undefined' !== typeof module) {
    module.exports = TestBase;
}
