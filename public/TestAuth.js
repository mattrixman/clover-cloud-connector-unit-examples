var sdk = require("remote-pay-cloud-api");
var ExampleCloverConnectorListener = require("./ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("./TestBase.js");

/* Start: Test a auth */
/**
 * A test of the auth functionality.
 *
 * @type {AuthExampleCloverConnectorListener}
 */
var AuthExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

AuthExampleCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
AuthExampleCloverConnectorListener.prototype.constructor = AuthExampleCloverConnectorListener;

AuthExampleCloverConnectorListener.prototype.onReady = function (merchantInfo) {
    ExampleCloverConnectorListener.prototype.onReady.call(this, merchantInfo);
    /*
     The connector is ready, create a auth request and send it to the device.
     */
    var authRequest = new sdk.remotepay.AuthRequest();
    authRequest.setExternalId(clover.CloverID.getNewId());
    authRequest.setAmount(10010);
    this.displayMessage({message: "Sending auth", request: authRequest});
    this.cloverConnector.auth(authRequest);
};
AuthExampleCloverConnectorListener.prototype.onAuthResponse = function (response) {
    /*
     The sale is complete.  It might be canceled, or successful.  This can be determined by the
     values in the response.
     */
    this.displayMessage({ message: "Auth response received", response: response});
    if(!response.getIsAuth()) {
        this.displayMessage({error: "Response is not an auth!"});
    }
    // Always call this when your test is done, or the device may fail to connect the
    // next time, because it is already connected.
    this.testComplete();
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
AuthExampleCloverConnectorListener.prototype.getTestName = function() {
    return "Test Auth";
};

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestAuth = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestAuth.prototype = Object.create(TestBase.prototype);
TestAuth.prototype.constructor = TestSale;

TestAuth.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new AuthExampleCloverConnectorListener(cloverConnector, progressinfoCallback);
};

/**
 * Attach the test of a auth to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestAuth = function(configUrl, progressinfoCallback) {
    var testObj = new TestAuth(configUrl, "test", progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestAuth;
}
