var TestBase = require("./TestBase.js");

// Each of the following decorates TestBase
require("./TestSale.js");
require("./TestAuth.js");
require("./TestPreAuth.js");
require("./TestPreAuthCapture.js");
require("./TestReadCardData.js");
require("./TestShowMessage.js");
require("./TestSaleTipAdjust.js");
require("./TestSaleVoid.js");
require("./TestSaleRefund.js");
require("./TestSaleRefundErr.js");
require("./TestSalePartialRefund.js");


if ('undefined' !== typeof module) {
    module.exports = TestBase;
}
