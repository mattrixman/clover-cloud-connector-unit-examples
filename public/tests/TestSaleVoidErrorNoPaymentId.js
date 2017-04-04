var sdk = require("remote-pay-cloud-api");
var ExampleCloverConnectorListener = require("../ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("../TestBase.js");

/* Start: Test a sale */
/**
 * A test of the sale functionality.
 *
 * @type {ExampleCloverConnectorListener}
 */
var SaleVoidErrorNoPaymentIdExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

SaleVoidErrorNoPaymentIdExampleCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
SaleVoidErrorNoPaymentIdExampleCloverConnectorListener.prototype.constructor = SaleVoidErrorNoPaymentIdExampleCloverConnectorListener;

SaleVoidErrorNoPaymentIdExampleCloverConnectorListener.prototype.startTest = function () {
    ExampleCloverConnectorListener.prototype.startTest.call(this);
    /*
     The connector is ready, create a sale request and send it to the device.
     */
    var saleRequest = new sdk.remotepay.SaleRequest();
    saleRequest.setExternalId(clover.CloverID.getNewId());
    saleRequest.setAmount(10000);
    this.displayMessage({message: "Sending sale", request: saleRequest});
    this.cloverConnector.sale(saleRequest);
};

SaleVoidErrorNoPaymentIdExampleCloverConnectorListener.prototype.onSaleResponse = function (response) {
    /*
     The sale is complete.  It might be canceled, or successful.  This can be determined by the
     values in the response.
     */
    this.displayMessage({message: "Sale response received", response: response});
    if (!response.getIsSale()) {
        this.displayMessage({error: "Response is not a sale!  Will continue and try to void anyway..."});
    }
    var request = new sdk.remotepay.VoidPaymentRequest();

    request.setOrderId(response.getPayment().getOrder().getId());
    // request.setPaymentId(response.getPayment().getId());
    request.setVoidReason(clover.order.VoidReason.USER_CANCEL);

    this.cloverConnector.voidPayment(request);
};

/**
 * Will be called after a void payment request and contains the voided paymentId
 * @memberof remotepay.ICloverConnectorListener
 *
 * @param response
 * @return void
 */
SaleVoidErrorNoPaymentIdExampleCloverConnectorListener.prototype.onVoidPaymentResponse = function (response) {
    this.displayMessage({message: "VoidPaymentResponse received", response: response});
    if (response.getSuccess()) {
        this.displayMessage({message: "VoidPaymentResponse,  !!! something is wrong, this should have failed !!!"});
    }

    setTimeout(function () {
        // Always call this when your test is done, or the device may fail to connect the
        // next time, because it is already connected.
        this.testComplete(!response.getSuccess());
    }.bind(this), 15000);
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
SaleVoidErrorNoPaymentIdExampleCloverConnectorListener.prototype.getTestName = function () {
    return "Test VoidPaymentResponse";
};
/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestSaleVoidErrorNoPaymentId = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestSaleVoidErrorNoPaymentId.prototype = Object.create(TestBase.prototype);
TestSaleVoidErrorNoPaymentId.prototype.constructor = TestSaleVoidErrorNoPaymentId;

TestSaleVoidErrorNoPaymentId.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new SaleVoidErrorNoPaymentIdExampleCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestSaleVoidErrorNoPaymentId = function (configUrl, configFile, progressinfoCallback) {
    var testObj = new TestSaleVoidErrorNoPaymentId(configUrl, configFile, progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestSaleVoidErrorNoPaymentId;
}
