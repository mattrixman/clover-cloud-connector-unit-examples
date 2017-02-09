var sdk = require("remote-pay-cloud-api");
var ExampleCloverConnectorListener = require("../ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("../TestBase.js");

var ResetExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

ResetExampleCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
ResetExampleCloverConnectorListener.prototype.constructor = ResetExampleCloverConnectorListener;

ResetExampleCloverConnectorListener.prototype.startTest = function () {
    ExampleCloverConnectorListener.prototype.startTest.call(this);

    /*
     The connector is ready, create a sale request and send it to the device.
     */
    var saleRequest = new sdk.remotepay.SaleRequest();
    saleRequest.setExternalId(clover.CloverID.getNewId());
    saleRequest.setAmount(10);
    this.displayMessage({message: "Sending sale", request: saleRequest});
    this.cloverConnector.sale(saleRequest);

    this.displayMessage({message: "Waiting five seconds before sending reset"});
    setTimeout(function () {
        this.displayMessage({message: "Sending reset to display"});
        this.cloverConnector.resetDevice();
        setTimeout(function () {
            // Always call this when your test is done, or the device may fail to connect the
            // next time, because it is already connected.
            this.testComplete(true);
        }.bind(this), 5000);
    }.bind(this), 5000);
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
ResetExampleCloverConnectorListener.prototype.getTestName = function () {
    return "Test resetting the device";
};

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestReset = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestReset.prototype = Object.create(TestBase.prototype);
TestReset.prototype.constructor = TestReset;

TestReset.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new ResetExampleCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

TestBase.TestReset = function (configUrl, progressinfoCallback) {
    var testObj = new TestReset(configUrl, "test", progressinfoCallback);
    testObj.test();
};
