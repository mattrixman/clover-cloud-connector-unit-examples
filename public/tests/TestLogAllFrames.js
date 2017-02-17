var sdk = require("remote-pay-cloud-api");
var ExampleCloverConnectorListener = require("../ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("../TestBase.js");

/* Start: Test a sale */
/**
 * A test of the sale functionality.
 *
 * @type {AllFramesExampleCloverConnectorListener}
 */
var AllFramesExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

AllFramesExampleCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
AllFramesExampleCloverConnectorListener.prototype.constructor = AllFramesExampleCloverConnectorListener;

AllFramesExampleCloverConnectorListener.prototype.startTest = function () {
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
AllFramesExampleCloverConnectorListener.prototype.onSaleResponse = function (response) {
    /*
     The sale is complete.  It might be canceled, or successful.  This can be determined by the
     values in the response.
     */
    this.displayMessage({message: "Sale response received", response: response});
    if (!response.getIsSale()) {
        this.displayMessage({error: "Response is not a sale!"});
    }
    // Always call this when your test is done, or the device may fail to connect the
    // next time, because it is already connected.
    this.testComplete(response.getSuccess());
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
AllFramesExampleCloverConnectorListener.prototype.getTestName = function () {
    return "Test Sale";
};

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestLogAllFrames = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestLogAllFrames.prototype = Object.create(TestBase.prototype);
TestLogAllFrames.prototype.constructor = TestLogAllFrames;

TestLogAllFrames.prototype.getCloverConnectorListener = function (cloverConnector) {
    /*
     This is a hook into the cloverConnector to listen to all messages and react to them in some way.
     */
    cloverConnector.device.on(clover.WebSocketDevice.ALL_MESSAGES,
      function (message) {
          // Do not handle ping or pong
          if ((message['type'] != 'PONG') && (message['type'] != 'PING')) {
              console.log("Handle all messages", message);
          }
      }.bind(this)
    );
    return new AllFramesExampleCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestLogAllFrames = function(configUrl, configFile, progressinfoCallback) {
    var testObj = new TestLogAllFrames(configUrl, configFile, progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestLogAllFrames;
}
