var ExampleCloverConnectorListener = require("../ExampleCloverConnectorListener.js");
var TestBase = require("../TestBase.js");

var ShowMessageExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

ShowMessageExampleCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
ShowMessageExampleCloverConnectorListener.prototype.constructor = ShowMessageExampleCloverConnectorListener;

ShowMessageExampleCloverConnectorListener.prototype.startTest = function () {
    ExampleCloverConnectorListener.prototype.startTest.call(this);
    /*
     The connector is ready, you can use it to communicate with the device.
    */
    this.displayMessage({message: "Sending message to display"});
    this.cloverConnector.showMessage("This message was sent to this device from the test framework");
    setTimeout(function () {
        // Always call this when your test is done, or the device may fail to connect the
        // next time, because it is already connected.
        this.testComplete(true);
    }.bind(this), 5000);
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
ShowMessageExampleCloverConnectorListener.prototype.getTestName = function () {
    return "Test Displaying a message on the device";
};

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestShowMessage = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestShowMessage.prototype = Object.create(TestBase.prototype);
TestShowMessage.prototype.constructor = TestShowMessage;

TestShowMessage.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new ShowMessageExampleCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

TestBase.TestShowMessage = function (configUrl, configFile, progressinfoCallback) {
    console.log('Running test TestShowMessage with config '+configUrl+configFile);
    var testObj = new TestShowMessage(configUrl, configFile, progressinfoCallback);
    testObj.test();
};
