var sdk = require("remote-pay-cloud-api");
var ExampleCloverConnectorListener = require("./ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("./TestBase.js");

/* Start: Test a sale */
/**
 * A test of the sale functionality.
 *
 * @type {SaleExceptionExampleCloverConnectorListener}
 */
var SaleExceptionExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

SaleExceptionExampleCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
SaleExceptionExampleCloverConnectorListener.prototype.constructor = SaleExceptionExampleCloverConnectorListener;

SaleExceptionExampleCloverConnectorListener.prototype.onReady = function (merchantInfo) {
    ExampleCloverConnectorListener.prototype.onReady.call(this, merchantInfo);
    /*
     The connector is ready, create a sale request and send it to the device.
     */
    var saleRequest = new sdk.remotepay.SaleRequest();
    saleRequest.setExternalId(clover.CloverID.getNewId());
    saleRequest.setAmount(10000);
    this.displayMessage({message: "Sending sale", request: saleRequest});
    this.cloverConnector.sale(saleRequest);
};
SaleExceptionExampleCloverConnectorListener.prototype.onSaleResponse = function (response) {
    /*
     The sale is complete.  It might be canceled, or successful.  This can be determined by the
     values in the response.
     */
    this.displayMessage({message: "Sale response received", response: response});
    if (!response.getIsSale()) {
        this.displayMessage({error: "Response is not a sale!"});
    }
    // Always call this when your test is done, or the device may fail to connect the
    // next time, because it is already connected.
    this.testComplete();
};

SaleExceptionExampleCloverConnectorListener.prototype.onConfirmPaymentRequest = function(request) {
    // Defined so that the device will stay on the "Merchant is verifying your payment" screen to
    // be able to explicity perform some operations which should result in a void of the current payment
    // transaction.
};


/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
SaleExceptionExampleCloverConnectorListener.prototype.getTestName = function () {
    return "Test Sale With Exceptional Processing";
};

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestSaleExceptionProcessing = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestSaleExceptionProcessing.prototype = Object.create(TestBase.prototype);
TestSaleExceptionProcessing.prototype.constructor = TestSaleExceptionProcessing;

TestSaleExceptionProcessing.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new SaleExceptionExampleCloverConnectorListener(cloverConnector, progressinfoCallback);
};

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestSaleExceptionProcessing = function(configUrl, progressinfoCallback) {
    var testObj = new TestSaleExceptionProcessing(configUrl, "test", progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestSaleExceptionProcessing;
}
