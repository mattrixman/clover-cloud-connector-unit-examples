var sdk = require("remote-pay-cloud-api");
var ExampleCloverConnectorListener = require("./ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("./TestBase.js");

/* Start: Test a sale */
/**
 * A test of the sale functionality.
 *
 * @type {SaleExampleCloverConnectorListener}
 */
var SaleRefuseReconnectLogicExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

SaleRefuseReconnectLogicExampleCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
SaleRefuseReconnectLogicExampleCloverConnectorListener.prototype.constructor = SaleRefuseReconnectLogicExampleCloverConnectorListener;

SaleRefuseReconnectLogicExampleCloverConnectorListener.prototype.onReady = function (merchantInfo) {
    ExampleCloverConnectorListener.prototype.onReady.call(this, merchantInfo);
    /*
     The connector is ready, create a sale request and send it to the device.
     */
    var saleRequest = new sdk.remotepay.SaleRequest();
    saleRequest.setExternalId(clover.CloverID.getNewId());
    saleRequest.setAmount(10000);
    this.displayMessage({message: "Sending sale", request: saleRequest});
    this.cloverConnector.sale(saleRequest);
    this.onReadyAlreadyCalled = true;

    this.cloverConnector.onResetRequest = function(){
        this.displayMessage({message: "Refusing to reconnect!  This is a bad idea!"});
    }.bind(this);

};
SaleRefuseReconnectLogicExampleCloverConnectorListener.prototype.onSaleResponse = function (response) {
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
SaleRefuseReconnectLogicExampleCloverConnectorListener.prototype.getTestName = function () {
    return "Test Sale";
};

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestSaleRefuseReconnectLogic = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestSaleRefuseReconnectLogic.prototype = Object.create(TestBase.prototype);
TestSaleRefuseReconnectLogic.prototype.constructor = TestSaleRefuseReconnectLogic;

TestSaleRefuseReconnectLogic.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new SaleRefuseReconnectLogicExampleCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestSaleRefuseReconnectLogic = function(configUrl, progressinfoCallback) {
    var testObj = new TestSaleRefuseReconnectLogic(configUrl, "test", progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestSaleRefuseReconnectLogic;
}
