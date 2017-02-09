var sdk = require("remote-pay-cloud-api");
var ExampleCloverConnectorListener = require("../ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("../TestBase.js");

/* Start: Test a sale */
/**
 * A test of the sale functionality.
 *
 * @type {ManualRefundExampleCloverConnectorListener}
 */
var ManualRefundExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

ManualRefundExampleCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
ManualRefundExampleCloverConnectorListener.prototype.constructor = ManualRefundExampleCloverConnectorListener;

ManualRefundExampleCloverConnectorListener.prototype.startTest = function () {
    ExampleCloverConnectorListener.prototype.startTest.call(this);
    /*
     The connector is ready, create a sale request and send it to the device.
     */
    var manualRefundRequest = new sdk.remotepay.ManualRefundRequest();
    manualRefundRequest.setExternalId(clover.CloverID.getNewId());
    manualRefundRequest.setAmount(10);
    this.displayMessage({message: "Sending sale", request: manualRefundRequest});
    this.cloverConnector.manualRefund(manualRefundRequest);
};
ManualRefundExampleCloverConnectorListener.prototype.onManualRefundResponse = function (response) {
    /*
     The operation is complete.  It might be canceled, or successful.  This can be determined by the
     values in the response.
     */
    this.displayMessage({message: "ManualRefund response received", response: response});
    // Always call this when your test is done, or the device may fail to connect the
    // next time, because it is already connected.
    this.testComplete(response.getSuccess());
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
ManualRefundExampleCloverConnectorListener.prototype.getTestName = function () {
    return "Manual Refund Sale";
};

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestManualRefund = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestManualRefund.prototype = Object.create(TestBase.prototype);
TestManualRefund.prototype.constructor = TestManualRefund;

TestManualRefund.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new ManualRefundExampleCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestManualRefund = function(configUrl, configFile, progressinfoCallback) {
    var testObj = new TestManualRefund(configUrl, configFile, progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestManualRefund;
}
