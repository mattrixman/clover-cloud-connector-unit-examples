var sdk = require("remote-pay-cloud-api");
var ExampleCloverConnectorListener = require("./ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("./TestBase.js");

/* Start: Test a sale */
/**
 * A test of the sale functionality.
 *
 * @type {ExampleCloverConnectorListener}
 */
var SalePartialRefundExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

SalePartialRefundExampleCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
SalePartialRefundExampleCloverConnectorListener.prototype.constructor = SalePartialRefundExampleCloverConnectorListener;

SalePartialRefundExampleCloverConnectorListener.prototype.startTest = function () {
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

SalePartialRefundExampleCloverConnectorListener.prototype.onSaleResponse = function (response) {
    /*
     The sale is complete.  It might be canceled, or successful.  This can be determined by the
     values in the response.
     */
    this.displayMessage({message: "Sale response received", response: response});
    if (!response.getIsSale()) {
        this.displayMessage({error: "Response is not a sale!"});
        // Failing for the wrong reason...
        this.testComplete();
        return;
    }
    var request = new sdk.remotepay.RefundPaymentRequest();

    request.setOrderId(response.getPayment().getOrder().getId());
    request.setPaymentId(response.getPayment().getId());
    request.setAmount(1000);

    this.displayMessage({message: "Sending partial refund - $10", request: request});
    this.cloverConnector.refundPayment(request);
};

/**
 * Will be called after a refund payment request and contains the Refund if successful. The Refund contains the original paymentId as reference
 * @memberof remotepay.ICloverConnectorListener
 *
 * @param {remotepay.RefundPaymentResponse} response
 * @return void
 */
SalePartialRefundExampleCloverConnectorListener.prototype.onRefundPaymentResponse = function (response) {
    this.displayMessage({message: "RefundPaymentResponse received", response: response});
    if (!response.getSuccess()) {
        this.displayMessage({message: "RefundPaymentResponse,  !!! something is wrong, this failed !!!"});
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
SalePartialRefundExampleCloverConnectorListener.prototype.getTestName = function () {
    return "Test Partial Refund Payment";
};
/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestSalePartialRefund = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestSalePartialRefund.prototype = Object.create(TestBase.prototype);
TestSalePartialRefund.prototype.constructor = TestSalePartialRefund;

TestSalePartialRefund.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new SalePartialRefundExampleCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestSalePartialRefund = function (configUrl, progressinfoCallback) {
    var testObj = new TestSalePartialRefund(configUrl, "test", progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestSalePartialRefund;
}
