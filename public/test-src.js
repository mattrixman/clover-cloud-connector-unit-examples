var TestBase = require("./TestBase.js");
// Remove the following to turn off logging.
require("remote-pay-cloud").DebugConfig.loggingEnabled = true;

TestBase.ForceDisconnect = require("./ForceDisconnect.js");

// Each of the following decorates TestBase
require("./TestSale.js");
require("./TestSaleDoubleReceiptScreen.js");
require("./TestSaleExceptionProcessing.js");
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
require("./TestVaultCard.js");
require("./TestSaleNullRequest.js");
require("./TestSaleNullExternalId.js");
require("./TestSaleNegZeroAmount.js");
require("./TestReadCardDataFail.js");
require("./TestReset.js");
require("./TestFailTransactionOnRestart.js");

if ('undefined' !== typeof module) {
    module.exports = TestBase;
}
