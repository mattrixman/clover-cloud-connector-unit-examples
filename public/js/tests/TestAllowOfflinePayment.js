var sdk = require("remote-pay-cloud-api");
var ExampleCloverConnectorListener = require("../ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("../TestBase.js");

/* Start: Test the allowOfflinePayment transaction setting on a SaleRequest */
/**
 * A test of the allowOfflinePayment functionality.
 *
 * @type {TestAllowOfflinePaymentCloverConnectorListener}
 */
var TestAllowOfflinePaymentCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

TestAllowOfflinePaymentCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
TestAllowOfflinePaymentCloverConnectorListener.prototype.constructor = TestAllowOfflinePaymentCloverConnectorListener;

TestAllowOfflinePaymentCloverConnectorListener.prototype.startTest = function () {
    ExampleCloverConnectorListener.prototype.startTest.call(this);
    /*
     The connector is ready, create a saleRequest, set the allowOfflinePayment transaction setting to true, and send it to the device.
     */
    var saleRequest = new sdk.remotepay.SaleRequest();
    saleRequest.setExternalId(clover.CloverID.getNewId());
    saleRequest.setAmount(999);
    saleRequest.setAllowOfflinePayment(true);
    this.displayMessage({message: "Sending sale", request: saleRequest});
    this.cloverConnector.sale(saleRequest);
};

TestAllowOfflinePaymentCloverConnectorListener.prototype.onDeviceActivityStart = function(deviceEvent) {
  console.log("deviceEvent:\n");
  console.log(deviceEvent);
};

TestAllowOfflinePaymentCloverConnectorListener.prototype.onSaleResponse = function (response) {
    /*
     The sale is complete.  It might be canceled, or successful.  This can be determined by the
     values in the response.
     */
    this.displayMessage({message: "Sale response received", response: response});
    if (!response.getIsSale()) {
        this.displayMessage({error: "Response is not a sale!"});
        this.testComplete();
        return;
    }
    // Always call this when your test is done, or the device may fail to connect the
    // next time, because it is already connected.
    this.testComplete(response.getSuccess());
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
TestAllowOfflinePaymentCloverConnectorListener.prototype.getTestName = function () {
    return "Test the allowOfflinePayment transaction setting";
};

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
var TestAllowOfflinePayment = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestAllowOfflinePayment.prototype = Object.create(TestBase.prototype);
TestAllowOfflinePayment.prototype.constructor = TestAllowOfflinePayment;

TestAllowOfflinePayment.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new TestAllowOfflinePaymentCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestAllowOfflinePayment = function(configUrl, configFile, progressinfoCallback) {
    var testObj = new TestAllowOfflinePayment(configUrl, configFile, progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestAllowOfflinePayment;
}
