var $ = require('jquery');
var sdk = require("remote-pay-cloud-api");
SimpleCloverConfig = require("./SimpleCloverConfig");
var clover = require("remote-pay-cloud");

/**
 * This connects to the designated device, forcing the connection.  It then disconnects.
 * This has the effect of forcing the device to close all connections.
 *
 * @param configUrl
 * @constructor
 */
var ForceDisconnect = function (configUrl) {
    this.configUrl = configUrl;
    this.log = clover.Logger.create();
    this.simpleCloverConfig = new SimpleCloverConfig(this.log);
};

/**
 * After creating an instance of this object, this is called to initiate the process (by the user/agent)
 */
ForceDisconnect.prototype.run = function() {
    // Loads the configuration, then calls the supplied callback - readyTest
    this.simpleCloverConfig.loadCloverConfig(this.configUrl, {forceConnect: true, friendlyId: 'forced'}, this.readyTest.bind(this));
};

/**
 * Build the clover connector and listener, and configure them.
 * @param error - if there was a problem loading configuration, or other error.
 * @param configuration - the configuration to use in creating the connector.
 */
ForceDisconnect.prototype.readyTest = function(error, configuration) {
    if(error) {
        this.log.error({error: error});
    } else {
        this.connector = new clover.CloverConnectorFactory().createICloverConnector(configuration);
        var connectorListener = new ForceDisconnectConnectorListener(this.connector, this.log);
        this.connector.addCloverConnectorListener(connectorListener);
        this.connector.initializeConnection();

        // Close the connection cleanly on exit.  This should be done with all connectors.
        $(window).on('beforeunload ', function () {
            try {
                this.connector.dispose();
            } catch (e) {
                console.log(e);
            }
        }.bind(this));
    }
};

/**
 * The constructor for the listener.  Saves a ref to the connector and log.
 * @param cloverConnector
 * @param log
 * @constructor
 */
var ForceDisconnectConnectorListener = function (cloverConnector, log) {
    sdk.remotepay.ICloverConnectorListener.call(this);
    this.cloverConnector = cloverConnector;
    this.log = log;
};

ForceDisconnectConnectorListener.prototype = Object.create(sdk.remotepay.ICloverConnectorListener.prototype);
ForceDisconnectConnectorListener.prototype.constructor = ForceDisconnectConnectorListener;

/**
 * Disconnects after waiting 5 seconds.
 * @param merchantInfo
 */
ForceDisconnectConnectorListener.prototype.onReady = function (merchantInfo) {
    setTimeout(function () {
        // Always call this when your test is done, or the device may fail to connect the
        // next time, because it is already connected.
        this.log.verbose(" * Force Disconnect is Closing connection * ");
        this.cloverConnector.dispose();
    }.bind(this), 5000);
};

if ('undefined' !== typeof module) {
    module.exports = ForceDisconnect;
}
