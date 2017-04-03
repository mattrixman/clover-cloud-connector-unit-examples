var PreAuthExampleCloverConnectorListener = require("../PreAuthExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("../TestBase.js");

/* Start: Test a preAuth, then capture it */
/**
 * A test of the preAuth + capture functionality.
 *
 * @type {ExampleCloverConnectorListener}
 */
var PreAuthCaptureExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    PreAuthExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

PreAuthCaptureExampleCloverConnectorListener.prototype = Object.create(PreAuthExampleCloverConnectorListener.prototype);
PreAuthCaptureExampleCloverConnectorListener.prototype.constructor = PreAuthCaptureExampleCloverConnectorListener;

/**
 * Override of immediate super.
 * @param response
 */
PreAuthCaptureExampleCloverConnectorListener.prototype.afterPreAuthResponse = function (response) {
    var capturePreAuthRequest = new sdk.remotepay.CapturePreAuthRequest();
    capturePreAuthRequest.setAmount(101000);
    capturePreAuthRequest.setTipAmount(10100);
    capturePreAuthRequest.setPaymentId(response.getPayment().getId());
    this.displayMessage({message: "Sending capture preAuth", request: capturePreAuthRequest});
    this.cloverConnector.capturePreAuth(capturePreAuthRequest);
};

PreAuthCaptureExampleCloverConnectorListener.prototype.onCapturePreAuthResponse = function (response) {
    this.displayMessage({message: "Capture PreAuth response received", response: response});
    if (!response.getSuccess()) {
        this.displayMessage({error: "Response was not successful!"});
        this.testComplete();
    } else if (response.getResult() != clover.remotepay.ResponseCode.SUCCESS) {
        this.displayMessage({error: "Response code is not SUCCESS!"});
        this.testComplete();
    } else {
        this.testComplete(response.getSuccess());
    }
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
PreAuthCaptureExampleCloverConnectorListener.prototype.getTestName = function () {
    return "Test Pre Auth then capture";
};

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestPreAuthCapture = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestPreAuthCapture.prototype = Object.create(TestBase.prototype);
TestPreAuthCapture.prototype.constructor = TestPreAuthCapture;

TestPreAuthCapture.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new PreAuthCaptureExampleCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

/**
 * Attach the test of a preAuth capture to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestPreAuthCapture = function(configUrl, configFile, progressinfoCallback) {
    var testObj = new TestPreAuthCapture(configUrl, configFile, progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestPreAuthCapture;
}
