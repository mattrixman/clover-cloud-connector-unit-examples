var sdk = require('remote-pay-cloud-api');
var ExampleCloverConnectorListener = require("../ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("../TestBase.js");

/**
 * A test of the disableDuplicateCheck transaction setting on a SaleRequest.
 *
 * @type {DisableDuplicateCheckExampleCloverConnectorListener}
 */
var DisableDuplicateCheckExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

DisableDuplicateCheckExampleCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
DisableDuplicateCheckExampleCloverConnectorListener.prototype.constructor = DisableDuplicateCheckExampleCloverConnectorListener;

DisableDuplicateCheckExampleCloverConnectorListener.prototype.startTest = function () {
    ExampleCloverConnectorListener.prototype.startTest.call(this);
    /*
     The connector is ready, create a sale request with disableDuplicateCheck = true and send it to the device.
     */
    var saleRequest = new sdk.remotepay.SaleRequest();
    saleRequest.setExternalId(clover.CloverID.getNewId());
    saleRequest.setAmount(100);
    saleRequest.disableDuplicateCheck = true;
    this.displayMessage({message: "Sending sale", request: saleRequest});
    this.cloverConnector.sale(saleRequest);
};
DisableDuplicateCheckExampleCloverConnectorListener.prototype.onSaleResponse = function (response) {
    /*
     The sale is complete.  It might be canceled, or successful.  This can be determined by the
     values in the response.
     */

    this.displayMessage({message: "Sale response received", response: response});
    if (!response.getIsSale()) {
        // Exit if a sale did not process as expected
        console.error("Response is not a sale!");
        this.testComplete();
        return;
    }
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
DisableDuplicateCheckExampleCloverConnectorListener.prototype.getTestName = function () {
    return "Test the disableDuplicateCheck transaction setting";
};

DisableDuplicateCheckExampleCloverConnectorListener.prototype.onConfirmPaymentRequest = function() {
  // do nothing. override the ExampleCloverConnectorListener's behavior of automatically
  // verifying all challenges.
};

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
var TestDisableDuplicateCheck = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestDisableDuplicateCheck.prototype = Object.create(TestBase.prototype);
TestDisableDuplicateCheck.prototype.constructor = TestDisableDuplicateCheck;

TestDisableDuplicateCheck.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new DisableDuplicateCheckExampleCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

/**
 * Attach the test of a disableDuplicateCheck to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestDisableDuplicateCheck = function(configUrl, configFile, progressinfoCallback) {
    var testObj = new TestDisableDuplicateCheck(configUrl, configFile, progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestDisableDuplicateCheck;
}
