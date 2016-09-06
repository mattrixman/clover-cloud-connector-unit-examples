var sdk = require("remote-pay-cloud-api");

/**
 * This is the base listener for the examples.
 *
 * @param cloverConnector
 * @param progressinfoCallback
 * @constructor
 */
var ExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    sdk.remotepay.ICloverConnectorListener.call(this);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

ExampleCloverConnectorListener.prototype = Object.create(sdk.remotepay.ICloverConnectorListener.prototype);
ExampleCloverConnectorListener.prototype.constructor = ExampleCloverConnectorListener;

ExampleCloverConnectorListener.prototype.onReady = function (merchantInfo) {
    this.displayMessage({message: "In onReady, starting test"});
};
ExampleCloverConnectorListener.prototype.onConfirmPaymentRequest = function(request) {
    /*
     Just send an automatic verification for all challenges.  If this is not implemented
     the device will stay on the "Merchant is verifying your payment" screen.
     */
    this.displayMessage({message: "Automatically accepting payment", request: request});
    this.cloverConnector.acceptPayment(request.getPayment());
};
ExampleCloverConnectorListener.prototype.onVerifySignatureRequest = function (request) {
    /*
     Just send an automatic verification for all signatures.  If this is not implemented
     the device will stay on the "Merchant is verifying your signature" screen.
     */
    this.displayMessage({message: "Automatically accepting signature", request: request});
    this.cloverConnector.acceptSignature(request);
};
ExampleCloverConnectorListener.prototype.testComplete = function () {
    this.displayMessage({ message: "Test Completed.  Cleaning up."});
    this.cloverConnector.dispose();
};
ExampleCloverConnectorListener.prototype.displayMessage = function(message) {
    this.progressinfoCallback({testName: this.getTestName(), message: message});
};
ExampleCloverConnectorListener.prototype.getTestName = function() {
    return "Sale Test";
};

if ('undefined' !== typeof module) {
    module.exports = ExampleCloverConnectorListener;
}
