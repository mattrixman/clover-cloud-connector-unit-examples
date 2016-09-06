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
var SaleTipAdjustExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

SaleTipAdjustExampleCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
SaleTipAdjustExampleCloverConnectorListener.prototype.constructor = SaleTipAdjustExampleCloverConnectorListener;

SaleTipAdjustExampleCloverConnectorListener.prototype.onReady = function (merchantInfo) {
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

SaleTipAdjustExampleCloverConnectorListener.prototype.onSaleResponse = function (response) {
    /*
     The sale is complete.  It might be canceled, or successful.  This can be determined by the
     values in the response.
     */
    this.displayMessage({message: "Sale response received", response: response});
    if (!response.getIsSale()) {
        this.displayMessage({error: "Response is not a sale!"});
    }
    var request = new sdk.remotepay.TipAdjustAuthRequest();

    request.setTipAmount(1000);
    request.setOrderId(response.getPayment().getOrder().getId());
    request.setPaymentId(response.getPayment().getId());

    // Note, this should fail!
    this.cloverConnector.tipAdjustAuth(request);
};

/**
 * Will be called after a tip adjust request and contains the tipAmount if successful
 * @memberof remotepay.ICloverConnectorListener
 *
 * @param response
 * @return void
 */
SaleTipAdjustExampleCloverConnectorListener.prototype.onTipAdjustAuthResponse = function (response) {
    this.displayMessage({message: "TipAdjustAuthResponse received", response: response});
    if (response.getSuccess()) {
        this.displayMessage({message: "TipAdjustAuthResponse,  !!! something is wrong, this should have failed but it succeeded !!!"});
    }

    // Always call this when your test is done, or the device may fail to connect the
    // next time, because it is already connected.
    this.testComplete();
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
SaleTipAdjustExampleCloverConnectorListener.prototype.getTestName = function () {
    return "Test TipAdjustAuthResponse";
};

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestSaleTipAdjust = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestSaleTipAdjust.prototype = Object.create(TestBase.prototype);
TestSaleTipAdjust.prototype.constructor = TestSaleTipAdjust;

TestSaleTipAdjust.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new SaleTipAdjustExampleCloverConnectorListener(cloverConnector, progressinfoCallback);
};

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestSaleTipAdjust = function(configUrl, progressinfoCallback) {
    var testObj = new TestSaleTipAdjust(configUrl, "test", progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestSaleTipAdjust;
}
