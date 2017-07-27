var clover = require("remote-pay-cloud");

// Remove the following to turn off logging.
clover.DebugConfig.loggingEnabled = true;

StandAloneExample = function() {
};

console.log(clover);

StandAloneExample.prototype.run = function() {
    var cloudConfiguration = new clover.WebSocketCloudCloverDeviceConfiguration(
        "com.mycompany.app.remoteApplicationId:0.0.1", // the applicationId that uniquely identifies the POS.
        clover.BrowserWebSocketImpl.createInstance, // function that will return an instance of the
        // CloverWebSocketInterface that will be used when connecting.  For Browser implementations, this can be
        // BrowserWebSocketImpl.createInstance.  For NodeJS implementations, this will be defined differently.  See
        // CloverWebSocketInterface
        new clover.ImageUtil(), // utility to translate images into base64 strings.
        "https://sandboxdev.dev.clover.com/", //the base url for the clover server used in the cloud connection.
        // EX:  https://www.clover.com, http://localhost:9000
        "7aacbd26-d900-8e6a-80f0-ae55f5d1cae2", // the OAuth access token that will be used when contacting the clover server. Tied to the
        // merchant and the app.
        new clover.HttpSupport(XMLHttpRequest), // the helper object used when making http requests.
        "VKYQ0RVGMYHRR", // the merchant the device belongs to.
        "f0f00afd4bc9c55ef0733e7cb8c3da97", // the id (not uuid) of the device to connect to
        "testTerminal1_connection1", //an identifier for the specific terminal connected to this device.  This id is used
        // in debugging and may be sent to other clients if they attempt to connect to the same device.  It will also be
        // sent to other clients that are currently connected if this device does a forceConnect.
        true //, // if true, overtake any existing connection.
        //heartbeatInterval, // not required - duration to wait for a PING before disconnecting
        //reconnectDelay // not required - duration to wait until a reconnect is attempted
    );
    var builderConfiguration = {};
    builderConfiguration[clover.CloverConnectorFactoryBuilder.FACTORY_VERSION] = clover.CloverConnectorFactoryBuilder.VERSION_12;
    var cloverConnectorFactory = clover.CloverConnectorFactoryBuilder.createICloverConnectorFactory(builderConfiguration);

    var cloverConnector = cloverConnectorFactory.createICloverConnector(cloudConfiguration);

    var connectorListener = new ExampleCloverConnectorListener(cloverConnector);
    cloverConnector.addCloverConnectorListener(connectorListener);

    cloverConnector.initializeConnection();
};

/**
 * This is the base listener for the examples.
 *
 * @param cloverConnector
 * @param progressinfoCallback
 * @constructor
 */
var ExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    clover.remotepay.ICloverConnectorListener.call(this);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
    this.testStarted = false;
};
ExampleCloverConnectorListener.prototype = Object.create(clover.remotepay.ICloverConnectorListener.prototype);
ExampleCloverConnectorListener.prototype.constructor = ExampleCloverConnectorListener;

/**
 * Call startTest() if not already flagged as a started test.
 * @param {clover.remotepay.MerchantInfo} merchantInfo - information on supported operations, and configurations.
 */
ExampleCloverConnectorListener.prototype.onDeviceReady = function (merchantInfo) {
    console.log({message: "In onDeviceReady, starting test", merchantInfo: merchantInfo});

    console.log({ message: "Test Completed.  Cleaning up." });
    this.cloverConnector.dispose();
};

/**
 * Send an automatic verification for all challenges.  If this is not implemented
 * the device will stay on the "Merchant is verifying your payment" screen.
 * @param request
 */
ExampleCloverConnectorListener.prototype.onConfirmPaymentRequest = function(request) {
    console.log({message: "Automatically accepting payment", request: request});
    this.cloverConnector.acceptPayment(request.getPayment());
};

/**
 * Send an automatic verification for all signatures.  If this is not implemented
 * the device will stay on the "Merchant is verifying your signature" screen.
 * @param request
 */
ExampleCloverConnectorListener.prototype.onVerifySignatureRequest = function (request) {
    console.log({message: "Automatically accepting signature", request: request});
    this.cloverConnector.acceptSignature(request);
};

/**
 * Will be called when an error occurs when trying to send messages to the device
 * @memberof remotepay.ICloverConnectorListener
 *
 * @param {remotepay.CloverDeviceErrorEvent} deviceErrorEvent
 * @return void
 */
ExampleCloverConnectorListener.prototype.onDeviceError = function(deviceErrorEvent) {
    console.error("onDeviceError", deviceErrorEvent);
    console.log({ message: "Test Error.", success: false, deviceErrorEvent});
};

if ('undefined' !== typeof module) {
    module.exports = StandAloneExample;
}