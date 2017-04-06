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
var SaleVoidExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

SaleVoidExampleCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
SaleVoidExampleCloverConnectorListener.prototype.constructor = SaleVoidExampleCloverConnectorListener;

SaleVoidExampleCloverConnectorListener.prototype.startTest = function () {
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

SaleVoidExampleCloverConnectorListener.prototype.onSaleResponse = function (response) {
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
    request.setPaymentId(response.getPayment().getId());
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
SaleVoidExampleCloverConnectorListener.prototype.onVoidPaymentResponse = function (response) {
    this.displayMessage({message: "VoidPaymentResponse received", response: response});
    if (!response.getSuccess()) {
        this.displayMessage({message: "VoidPaymentResponse,  !!! something is wrong, this failed !!!"});
    }
    // Always call this when your test is done, or the device may fail to connect the
    // next time, because it is already connected.
    // this.testComplete(response.getSuccess());

    setTimeout(function () {
        // Always call this when your test is done, or the device may fail to connect the
        // next time, because it is already connected.
        this.testComplete(response.getSuccess());
    }.bind(this), 15000);
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
SaleVoidExampleCloverConnectorListener.prototype.getTestName = function () {
    return "Test VoidPaymentResponse";
};
/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestSaleVoid = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestSaleVoid.prototype = Object.create(TestBase.prototype);
TestSaleVoid.prototype.constructor = TestSaleVoid;

TestSaleVoid.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new SaleVoidExampleCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestSaleVoid = function (configUrl, configFile, progressinfoCallback) {
    var testObj = new TestSaleVoid(configUrl, configFile, progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestSaleVoid;
}
