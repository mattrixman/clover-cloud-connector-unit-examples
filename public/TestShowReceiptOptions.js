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
var ShowReceiptOptionsExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

ShowReceiptOptionsExampleCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
ShowReceiptOptionsExampleCloverConnectorListener.prototype.constructor = ShowReceiptOptionsExampleCloverConnectorListener;

ShowReceiptOptionsExampleCloverConnectorListener.prototype.startTest = function () {
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

ShowReceiptOptionsExampleCloverConnectorListener.prototype.onSaleResponse = function (response) {
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

    this.showingReceiptOptions = true;
    this.cloverConnector.showPaymentReceiptOptions(response.getPayment().getOrder().getId(), response.getPayment().getId());
};

/**
 * Will be called when leaving a screen or activity on the Mini. The CloverDeviceEvent passed in will contain an event type and description. Note: The Start and End events are not guaranteed to process in order, so the event type should be used to make sure the start and end events are paired.
 *
 * @param {remotepay.CloverDeviceEvent} deviceEvent
 * @return void
 */
ShowReceiptOptionsExampleCloverConnectorListener.prototype.onDeviceActivityEnd = function (deviceEvent) {
    this.displayMessage({message: "Device Activity End received - " + JSON.stringify(deviceEvent)});
    if(this.showingReceiptOptions) {
        if (deviceEvent.getEventState() == sdk.remotepay.DeviceEventState.RECEIPT_OPTIONS) {
            // Always call this when your test is done, or the device may fail to connect the
            // next time, because it is already connected.
            // In this case, this may cause some errors in the console, because we may
            // be shutting down the connection before the welcome screen has been shown.
            setTimeout(
              function() {
                this.testComplete(true);
              }.bind(this), 6000 /* wait 6 seconds */
            );
        }
    }
};


/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
ShowReceiptOptionsExampleCloverConnectorListener.prototype.getTestName = function () {
    return "Test Show Receipt Options";
};
/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestShowReceiptOptions = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestShowReceiptOptions.prototype = Object.create(TestBase.prototype);
TestShowReceiptOptions.prototype.constructor = TestShowReceiptOptions;

TestShowReceiptOptions.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new ShowReceiptOptionsExampleCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

/**
 * Attach the test to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestShowReceiptOptions = function (configUrl, progressinfoCallback) {
    var testObj = new TestShowReceiptOptions(configUrl, "test", progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestShowReceiptOptions;
}
