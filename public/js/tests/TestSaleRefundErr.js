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
var SaleRefundErrExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

SaleRefundErrExampleCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
SaleRefundErrExampleCloverConnectorListener.prototype.constructor = SaleRefundErrExampleCloverConnectorListener;

SaleRefundErrExampleCloverConnectorListener.prototype.startTest = function () {
try{
    ExampleCloverConnectorListener.prototype.startTest.call(this);
    /*
     The connector is ready, create a sale request and send it to the device.
     */
    var saleRequest = new sdk.remotepay.SaleRequest();
    saleRequest.setExternalId(clover.CloverID.getNewId());
    saleRequest.setAmount(10000);
    this.displayMessage({message: "Sending sale", request: saleRequest});
    this.cloverConnector.sale(saleRequest);
} catch (e) {
    console.log(e);
    this.testComplete(false);
}
};

SaleRefundErrExampleCloverConnectorListener.prototype.onSaleResponse = function (response) {
try {
    /*
     The sale is complete.  It might be canceled, or successful.  This can be determined by the
     values in the response.
     */
    this.displayMessage({message: "Sale response received", response: response});
    if (!response.getIsSale()) {
        this.displayMessage({error: "Response is not a sale!  Will try to continue anyway..."});
    }
    var request = new sdk.remotepay.RefundPaymentRequest();

    // Force error by omitting order id
    // request.setOrderId(response.getPayment().getOrder().getId());
    request.setPaymentId(response.getPayment().getId());
    request.setFullRefund(true);

    this.cloverConnector.refundPayment(request);
} catch (e) {
    console.log(e);
    this.testComplete(false);
}
};

/**
 * Will be called after a refund payment request and contains the Refund if successful. The Refund contains the original paymentId as reference
 * @memberof remotepay.ICloverConnectorListener
 *
 * @param {remotepay.RefundPaymentResponse} response
 * @return void
 */
SaleRefundErrExampleCloverConnectorListener.prototype.onRefundPaymentResponse = function (response) {
try {
    this.displayMessage({message: "RefundPaymentResponse received", response: response});

    if (response.getSuccess()) {
        this.displayMessage({message: "RefundPaymentResponse,  !!! something is wrong, this should have failed !!!"});
        this.testComplete(false);
        return;
    }
    // Always call this when your test is done, or the device may fail to connect the
    // next time, because it is already connected.
    this.testComplete(true);
} catch (e) {
    console.log(e);
    this.testComplete(false);
}
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
SaleRefundErrExampleCloverConnectorListener.prototype.getTestName = function () {
    return "Test Refund Full Payment, should fail";
};
/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestSaleRefundErr = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestSaleRefundErr.prototype = Object.create(TestBase.prototype);
TestSaleRefundErr.prototype.constructor = TestSaleRefundErr;

TestSaleRefundErr.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new SaleRefundErrExampleCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestSaleRefundErr = function (configUrl, configFile, progressinfoCallback) {
    var testObj = new TestSaleRefundErr(configUrl, configFile, progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestSaleRefundErr;
}
