var clover = require("remote-pay-cloud");

// Remove the following to turn off logging.
clover.DebugConfig.loggingEnabled = true;

//////////////////////////////////////////////////////
// Create the Network Websocket Pairing Configuration
//////////////////////////////////////////////////////
var ExampleWebsocketPairedCloverDeviceConfiguration = function() {
    clover.WebSocketPairedCloverDeviceConfiguration.call(this,
        "wss://192.168.0.27:12345/remote_pay", //endpoint
        "com.cloverconnector.javascript.simple.sample:1.3.1", //remoteApplicationID
        "Javascript Simple Sample", // Displayed during pairing to display the POS name on the Mini. e.g. MyPOS
        "Register_1", // Displayed during pairing to display the device identifier. e.g. 'Aisle 3' or 'POS-35153234'
        null, // The authToken retrieved from a previous pairing activity, passed as an argument to onPairingSuccess. This will be null for the first connection
        clover.BrowserWebSocketImpl.createInstance, // function that will return an instance of the
        // CloverWebSocketInterface that will be used when connecting.  For Browser implementations, this can be
        // BrowserWebSocketImpl.createInstance.  For NodeJS implementations, this will be defined differently.  See
        // CloverWebSocketInterface
        new clover.ImageUtil() // // utility to translate images into base64 strings.
        // [heartbeatInterval] - duration to wait for a PING before disconnecting
        // [reconnectDelay] - duration to wait until a reconnect is attempted
    );
};
ExampleWebsocketPairedCloverDeviceConfiguration.prototype = Object.create(clover.WebSocketPairedCloverDeviceConfiguration.prototype);
ExampleWebsocketPairedCloverDeviceConfiguration.prototype.constructor = ExampleWebsocketPairedCloverDeviceConfiguration;

ExampleWebsocketPairedCloverDeviceConfiguration.prototype.onPairingCode = function(pairingCode) {
    console.log("Pairing code is " + pairingCode);
};

ExampleWebsocketPairedCloverDeviceConfiguration.prototype.onPairingSuccess = function(authToken) {
    console.log("Pairing succeeded, authToken is " + authToken);
};
//////////////////////////////////////////////////////
// Create the listener to respond to messages from the SDK
//////////////////////////////////////////////////////
var ExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    clover.remotepay.ICloverConnectorListener.call(this);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
    this.testStarted = false;
};
ExampleCloverConnectorListener.prototype = Object.create(clover.remotepay.ICloverConnectorListener.prototype);
ExampleCloverConnectorListener.prototype.constructor = ExampleCloverConnectorListener;

ExampleCloverConnectorListener.prototype.onDeviceReady = function (merchantInfo) {
    console.log({message: "In onDeviceReady, starting test", merchantInfo: merchantInfo});

    var readCardDataRequest = new clover.remotepay.ReadCardDataRequest();
    readCardDataRequest.setIsForceSwipePinEntry(false);
    // cardEntryMethods can be `ICC_CONTACT, MAG_STRIPE, NFC_CONTACTLESS` or some combination of those,
    // but not `MANUAL`
    readCardDataRequest.setCardEntryMethods(clover.CardEntryMethods.DEFAULT);
    this.cloverConnector.readCardData(readCardDataRequest);
};

ExampleCloverConnectorListener.prototype.onConfirmPaymentRequest = function(request) {
    console.log({message: "Automatically accepting payment", request: request});
    this.cloverConnector.acceptPayment(request.getPayment());
};

ExampleCloverConnectorListener.prototype.onVerifySignatureRequest = function (request) {
    console.log({message: "Automatically accepting signature", request: request});
    this.cloverConnector.acceptSignature(request);
};

ExampleCloverConnectorListener.prototype.onDeviceError = function(deviceErrorEvent) {
    console.error("onDeviceError", deviceErrorEvent);
    console.log({ message: "Test Error.", success: false, error: deviceErrorEvent});
};

ExampleCloverConnectorListener.prototype.onSaleResponse = function (response) {
    console.log({message: "Sale response received", response: response});
    if (!response.getIsSale()) {
        console.log({error: "Response is not a sale!"});
    }
    // Always call this when your test is done, or the device may fail to connect the
    // next time, because it is already connected.
    console.log({ message: "Test Completed.  Cleaning up." });
    this.cloverConnector.dispose();
};
//////////////////////////////////////////////////////
StandAloneExample = function() {
};

StandAloneExample.prototype.run = function() {
    // Create the instance of the configuration
    var networkConfiguration = new ExampleWebsocketPairedCloverDeviceConfiguration();
    var builderConfiguration = {};
    builderConfiguration[clover.CloverConnectorFactoryBuilder.FACTORY_VERSION] = clover.CloverConnectorFactoryBuilder.VERSION_12;
    var cloverConnectorFactory = clover.CloverConnectorFactoryBuilder.createICloverConnectorFactory(builderConfiguration);

    var cloverConnector = cloverConnectorFactory.createICloverConnector(networkConfiguration);

    var connectorListener = new ExampleCloverConnectorListener(cloverConnector);
    cloverConnector.addCloverConnectorListener(connectorListener);

    cloverConnector.initializeConnection();
};

////
ExampleCloverConnectorListener.prototype.onReadCardDataResponse = function (response) {
    /*
     The read is complete complete.  It might be canceled, failed, or successful.  This can be determined by the
     values in the response.
     */
    console.log({message: "Read card data response received", response: response});
    // Always call this when your test is done, or the device may fail to connect the
    // next time, because it is already connected.
    this.cloverConnector.dispose();
};

if ('undefined' !== typeof module) {
    module.exports = StandAloneExample;
}