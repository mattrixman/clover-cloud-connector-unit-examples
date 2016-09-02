require("prototype");

var TestBase = require("./TestBase.js");
var TestSale = require("./TestSale.js");
var TestAuth = require("./TestAuth.js");
var TestPreAuth = require("./TestPreAuth.js");
var TestPreAuthCapture = require("./TestPreAuthCapture.js");
var TestReadCardData = require("./TestReadCardData.js");
var TestShowMessage = require("./TestShowMessage.js");
var TestSaleTipAdjust = require("./TestSaleTipAdjust.js");
var TestSaleVoid = require("./TestSaleVoid.js");

if ('undefined' !== typeof module) {
    module.exports = TestBase;
}
