var TestBase = require("./TestBase.js");
// Remove the following to turn off logging.
require("remote-pay-cloud").DebugConfig.loggingEnabled = true;

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
require("./TestShowReceiptOptions.js");
require("./TestSaleWithReconnectLogic.js");
require("./TestSaleRefuseReconnectLogic.js");
require("./TestLogAllFrames.js");

if ('undefined' !== typeof module) {
    module.exports = TestBase;
}
