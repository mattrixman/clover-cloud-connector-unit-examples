var sdk = require("remote-pay-cloud-api");
var ExampleCloverConnectorListener = require("./ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("./TestBase.js");

/* Start: Test a sale */
/**
 * A test of the sale functionality.
 *
 * @type {SaleExampleNullRequestCloverConnectorListener}
 */
var SaleExampleNullRequestCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

SaleExampleNullRequestCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
SaleExampleNullRequestCloverConnectorListener.prototype.constructor = SaleExampleNullRequestCloverConnectorListener;

SaleExampleNullRequestCloverConnectorListener.prototype.onReady = function (merchantInfo) {
    ExampleCloverConnectorListener.prototype.onReady.call(this, merchantInfo);
    /*
     The connector is ready, create a sale request and send it to the device.
     */
    var saleRequest = new sdk.remotepay.SaleRequest();
    saleRequest.setExternalId(clover.CloverID.getNewId());
    saleRequest.setAmount(10000);
    this.displayMessage({message: "Sending sale", request: saleRequest});
    this.cloverConnector.sale(null /*saleRequest*/);
};
SaleExampleNullRequestCloverConnectorListener.prototype.onSaleResponse = function (response) {
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
    this.testComplete(!response.getSuccess());
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
SaleExampleNullRequestCloverConnectorListener.prototype.getTestName = function () {
    return "Test Sale NullRequest";
};

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestSaleNullRequest = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestSaleNullRequest.prototype = Object.create(TestBase.prototype);
TestSaleNullRequest.prototype.constructor = TestSaleNullRequest;

TestSaleNullRequest.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new SaleExampleNullRequestCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestSaleNullRequest = function(configUrl, progressinfoCallback) {
    var testObj = new TestSaleNullRequest(configUrl, "test", progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestSaleNullRequest;
}
