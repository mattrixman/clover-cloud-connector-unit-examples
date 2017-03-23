var sdk = require("remote-pay-cloud-api");
var ExampleCloverConnectorListener = require("../ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("../TestBase.js");

/* Start: Test a sale */
/**
 * A test of the sale functionality.
 *
 * @type {BadSigVerifyExampleCloverConnectorListener}
 */
var BadSigVerifyExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

BadSigVerifyExampleCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
BadSigVerifyExampleCloverConnectorListener.prototype.constructor = BadSigVerifyExampleCloverConnectorListener;

BadSigVerifyExampleCloverConnectorListener.prototype.startTest = function () {
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
BadSigVerifyExampleCloverConnectorListener.prototype.onSaleResponse = function (response) {
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
BadSigVerifyExampleCloverConnectorListener.prototype.getTestName = function () {
    return "Test Sale";
};

/**
 * Send an automatic verification for all signatures.  If this is not implemented
 * the device will stay on the "Merchant is verifying your signature" screen.
 * @param request
 */
BadSigVerifyExampleCloverConnectorListener.prototype.onVerifySignatureRequest = function (request) {
    this.displayMessage({message: "Automatically accepting signature", request: request});
    request.getPayment().setAmount(null);
    this.cloverConnector.acceptSignature(request);
};

/**
 * Will be called when an error occurs when trying to send messages to the device
 * @memberof remotepay.ICloverConnectorListener
 *
 * @param {remotepay.CloverDeviceErrorEvent} deviceErrorEvent
 * @return void
 */
BadSigVerifyExampleCloverConnectorListener.prototype.onDeviceError = function(deviceErrorEvent) {
    ExampleCloverConnectorListener.prototype.onDeviceError.call(this, deviceErrorEvent);
    setTimeout(function(){ this.testComplete(true);}.bind(this), 15000);
};


/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestBadSigVerify = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestBadSigVerify.prototype = Object.create(TestBase.prototype);
TestBadSigVerify.prototype.constructor = TestBadSigVerify;

TestBadSigVerify.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new BadSigVerifyExampleCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestBadSigVerify = function(configUrl, configFile, progressinfoCallback) {
    var testObj = new TestBadSigVerify(configUrl, configFile, progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestBadSigVerify;
}
