var sdk = require("remote-pay-cloud-api");
var ExampleCloverConnectorListener = require("../ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("../TestBase.js");

/* Start: Test a sale */
/**
 * A test of the sale functionality.
 *
 * @type {SaleExampleCloverConnectorListener}
 */
var SaleExampleFailOnTransactionRestartCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

SaleExampleFailOnTransactionRestartCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
SaleExampleFailOnTransactionRestartCloverConnectorListener.prototype.constructor = SaleExampleFailOnTransactionRestartCloverConnectorListener;

SaleExampleFailOnTransactionRestartCloverConnectorListener.prototype.startTest = function () {
    ExampleCloverConnectorListener.prototype.startTest.call(this);
    /*
     The connector is ready, create a sale request and send it to the device.
     */
    var saleRequest = new sdk.remotepay.SaleRequest();
    saleRequest.setExternalId(clover.CloverID.getNewId());
    saleRequest.setAmount(10);

    saleRequest.setDisableRestartTransactionOnFail(true);

    this.displayMessage({message: "Sending sale", request: saleRequest});
    this.cloverConnector.sale(saleRequest);
};
SaleExampleFailOnTransactionRestartCloverConnectorListener.prototype.onSaleResponse = function (response) {
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

    // Note that this is expecting that the user cancels the transaction on the device, either in
    // the signature screen or the transaction screen itself.
    this.testComplete(!response.getSuccess());
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
SaleExampleFailOnTransactionRestartCloverConnectorListener.prototype.getTestName = function () {
    return "Test Sale";
};

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestSaleFailOnTransactionRestart = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestSaleFailOnTransactionRestart.prototype = Object.create(TestBase.prototype);
TestSaleFailOnTransactionRestart.prototype.constructor = TestSaleFailOnTransactionRestart;

TestSaleFailOnTransactionRestart.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new SaleExampleFailOnTransactionRestartCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestSaleFailOnTransactionRestart = function(configUrl, progressinfoCallback) {
    var testObj = new TestSaleFailOnTransactionRestart(configUrl, "test", progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestSaleFailOnTransactionRestart;
}
