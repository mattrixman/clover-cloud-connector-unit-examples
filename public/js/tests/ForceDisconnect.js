var ExampleCloverConnectorListener = require("../ExampleCloverConnectorListener.js");
var TestBase = require("../TestBase.js");

var ForceDisconnectConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

ForceDisconnectConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
ForceDisconnectConnectorListener.prototype.constructor = ForceDisconnectConnectorListener;

ForceDisconnectConnectorListener.prototype.startTest = function () {
    ExampleCloverConnectorListener.prototype.startTest.call(this);

    this.displayMessage({message: "Will close connection in 5 seconds."});
    setTimeout(function () {
        // Always call this when your test is done, or the device may fail to connect the
        // next time, because it is already connected.
        this.displayMessage(" * Force Disconnect is Closing connection * ");
        this.cloverConnector.dispose();
        this.testComplete(true);
    }.bind(this), 5000);
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
ForceDisconnectConnectorListener.prototype.getTestName = function () {
    return "Force a disconnect on the device.  Overtakes the connection then closes it.";
};

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
ForceDisconnect = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

ForceDisconnect.prototype = Object.create(TestBase.prototype);
ForceDisconnect.prototype.constructor = ForceDisconnect;

ForceDisconnect.prototype.readyTest = function(error, configuration) {
    if(configuration) {
        configuration.forceConnect = true;
    }
    TestBase.prototype.readyTest.call(this, error, configuration);
};

ForceDisconnect.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new ForceDisconnectConnectorListener(cloverConnector, this.progressinfoCallback);
};

TestBase.ForceDisconnect = function (configUrl, configFile, progressinfoCallback) {
    progressinfoCallback('Running ForceDisconnect with config '+configUrl+configFile);
    var testObj = new ForceDisconnect(configUrl, configFile, progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = ForceDisconnect;
}
