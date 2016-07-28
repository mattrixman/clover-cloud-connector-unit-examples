var clover = require("remote-pay-cloud");

var ExampleCloverConnectorListener = Class.create( clover.remotepay.ICloverConnectorListener, {
    initialize: function (cloverConnector, progressinfoCallback) {
        this.cloverConnector = cloverConnector;
        this.progressinfoCallback = progressinfoCallback;
    },
    onReady: function (merchantInfo) {
        this.displayMessage({message: "In onReady, starting test"});
    },
    onConfirmPaymentRequest: function(request) {
        /*
         Just send an automatic verification for all challenges.  If this is not implemented
         the device will stay on the "Merchant is verifying your payment" screen.
         */
        this.displayMessage({message: "Automatically accepting payment", request: request});
        this.cloverConnector.acceptPayment(request.getPayment());
    },
    onVerifySignatureRequest: function (request) {
        /*
         Just send an automatic verification for all signatures.  If this is not implemented
         the device will stay on the "Merchant is verifying your signature" screen.
         */
        this.displayMessage({message: "Automatically accepting signature", request: request});
        this.cloverConnector.acceptSignature(request);
    },
    testComplete: function () {
        this.displayMessage({ message: "Test Completed.  Cleaning up."});
        this.cloverConnector.dispose();
    },
    displayMessage: function(message) {
        this.progressinfoCallback({testName: this.getTestName(), message: message});
    },
    getTestName: function() {
        return "Sale Test";
    }
});

if ('undefined' !== typeof module) {
    module.exports = ExampleCloverConnectorListener;
}
