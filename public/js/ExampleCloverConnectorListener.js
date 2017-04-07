var clover = require("remote-pay-cloud");

/**
 * This is the base listener for the examples.
 *
 * @param cloverConnector
 * @param progressinfoCallback
 * @constructor
 */
var ExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    clover.remotepay.ICloverConnectorListener.call(this);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
    this.testStarted = false;
};

ExampleCloverConnectorListener.prototype = Object.create(clover.remotepay.ICloverConnectorListener.prototype);
ExampleCloverConnectorListener.prototype.constructor = ExampleCloverConnectorListener;

/**
 * Call startTest() if not already flagged as a started test.
 * @param {clover.remotepay.MerchantInfo} merchantInfo - information on supported operations, and configurations.
 */
ExampleCloverConnectorListener.prototype.onReady = function (merchantInfo) {
    this.displayMessage({message: "In onReady, starting test"});
    if(!this.testStarted) {
        this.startTest();
    }
};

/**
 * Flag the test as started.  Expected to be overridden to provide the meat of the test.  Called from the `onReady`
 * function if the test has not already been started.  If the overriding function does NOT call this, then additional
 * calls to `onReady` will result in additional calls to this function.
 */
ExampleCloverConnectorListener.prototype.startTest = function() {
    this.testStarted = true;
};

/**
 * Send an automatic verification for all challenges.  If this is not implemented
 * the device will stay on the "Merchant is verifying your payment" screen.
 * @param request
 */
ExampleCloverConnectorListener.prototype.onConfirmPaymentRequest = function(request) {
    this.displayMessage({message: "Automatically accepting payment", request: request});
    this.cloverConnector.acceptPayment(request.getPayment());
};

/**
 * Send an automatic verification for all signatures.  If this is not implemented
 * the device will stay on the "Merchant is verifying your signature" screen.
 * @param request
 */
ExampleCloverConnectorListener.prototype.onVerifySignatureRequest = function (request) {
    this.displayMessage({message: "Automatically accepting signature", request: request});
    this.cloverConnector.acceptSignature(request);
};

/**
 * Dispose of the connector
 * @param success
 */
ExampleCloverConnectorListener.prototype.testComplete = function (success) {
    this.displayMessage({ message: "Test Completed.  Cleaning up.", success: success});
    this.cloverConnector.dispose();
};

/**
 * Calls the passed progressinfoCallback with the passed message, decorating it with the test name.
 * @param message
 */
ExampleCloverConnectorListener.prototype.displayMessage = function(message) {
    if(message.hasOwnProperty('message') || message.hasOwnProperty('error')) {
        message.testName = this.getTestName();
    } else {
        message = {testName: this.getTestName(), message: message};
    }
    this.progressinfoCallback(message);
};

/**
 * Used to identify the test in progress messages.
 * @returns {string}
 */
ExampleCloverConnectorListener.prototype.getTestName = function() {
    return "Example Test";
};

/**
 * Will be called when an error occurs when trying to send messages to the device
 * @memberof remotepay.ICloverConnectorListener
 *
 * @param {remotepay.CloverDeviceErrorEvent} deviceErrorEvent
 * @return void
*/
ExampleCloverConnectorListener.prototype.onDeviceError = function(deviceErrorEvent) {
    console.error("onDeviceError", deviceErrorEvent);
    this.displayMessage({ message: "Test Error.", success: false, deviceErrorEvent});
};

if ('undefined' !== typeof module) {
    module.exports = ExampleCloverConnectorListener;
}
