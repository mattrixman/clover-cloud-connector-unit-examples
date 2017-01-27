var sdk = require("remote-pay-cloud-api");
var ExampleCloverConnectorListener = require("./ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("./TestBase.js");

/* Start: Test a sale */
/**
 * A test of the sale functionality.
 *
 * @type {SaleDoubleReceiptScreenCloverConnectorListener}
 */
var SaleDoubleReceiptScreenCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

SaleDoubleReceiptScreenCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
SaleDoubleReceiptScreenCloverConnectorListener.prototype.constructor = SaleDoubleReceiptScreenCloverConnectorListener;

SaleDoubleReceiptScreenCloverConnectorListener.prototype.startTest = function () {
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
SaleDoubleReceiptScreenCloverConnectorListener.prototype.onSaleResponse = function (response) {
    /*
     The sale is complete.  It might be canceled, or successful.  This can be determined by the
     values in the response.
     */
    this.displayMessage({message: "Sale response received", response: response});
    if (!response.getIsSale()) {
        this.displayMessage({error: "Response is not a sale!"});
        this.testComplete(!response.getSuccess());
        return;
    }

    // Pop up the receipt window a second time to test handling this on an already completed sale which has processed
    // the recieipt screen previously.
    this.showingReceiptOptions = true;
    this.cloverConnector.showPaymentReceiptOptions(response.getPayment().getOrder().getId(), response.getPayment().getId());
};

/**
 * Will be called when leaving a screen or activity on the Mini. The CloverDeviceEvent passed in will contain an event type and description. Note: The Start and End events are not guaranteed to process in order, so the event type should be used to make sure the start and end events are paired.
 * @memberof remotepay.ICloverConnectorListener
 *
 * @param {remotepay.CloverDeviceEvent} deviceEvent
 * @return void
 */
SaleDoubleReceiptScreenCloverConnectorListener.prototype.onDeviceActivityEnd = function(deviceEvent) {
    if(deviceEvent.getEventState() == sdk.remotepay.DeviceEventState.RECEIPT_OPTIONS) {
        // Always call this when your test is done, or the device may fail to connect the
        // next time, because it is already connected.
        this.testComplete(true);
    }
};

SaleDoubleReceiptScreenCloverConnectorListener.prototype.onConfirmPaymentRequest = function(request) {
    /*
     Just send an automatic verification for all challenges.  If this is not implemented
     the device will stay on the "Merchant is verifying your payment" screen.
     */
    this.displayMessage({message: "Automatically accepting payment", request: request});
    this.cloverConnector.acceptPayment(request.getPayment());
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
SaleDoubleReceiptScreenCloverConnectorListener.prototype.getTestName = function () {
    return "Test Sale With Double Receipt Processing";
};

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestSaleDoubleReceiptProcessing = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestSaleDoubleReceiptProcessing.prototype = Object.create(TestBase.prototype);
TestSaleDoubleReceiptProcessing.prototype.constructor = TestSaleDoubleReceiptProcessing;

TestSaleDoubleReceiptProcessing.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new SaleDoubleReceiptScreenCloverConnectorListener(cloverConnector, progressinfoCallback);
};

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestSaleDoubleReceiptProcessing = function(configUrl, progressinfoCallback) {
    var testObj = new TestSaleDoubleReceiptProcessing(configUrl, "test", progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestSaleDoubleReceiptProcessing;
}
