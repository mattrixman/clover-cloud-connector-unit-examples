require("prototype");
var ExampleCloverConnectorListener = require("./ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("./TestBase.js");

/* Start: Test a auth */
/**
 * A test of the auth functionality.
 *
 * @type {ExampleCloverConnectorListener}
 */
var AuthExampleCloverConnectorListener = Class.create( ExampleCloverConnectorListener, {
    onReady: function ($super, merchantInfo) {
        $super(merchantInfo);
        /*
         The connector is ready, create a auth request and send it to the device.
         */
        var authRequest = new clover.remotepay.AuthRequest();
        authRequest.setExternalId(clover.CloverID.getNewId());
        authRequest.setAmount(10010);
        this.displayMessage({message: "Sending auth", request: authRequest});
        this.cloverConnector.auth(authRequest);
    },
    onAuthResponse: function (response) {
        /*
         The sale is complete.  It might be canceled, or successful.  This can be determined by the
         values in the response.
         */
        this.displayMessage({ message: "Auth response received", response: response});
        if(!response.getIsAuth()) {
            this.displayMessage({error: "Response is not an auth!"});
        }
        // Always call this when your test is done, orthe device may fail to connect the
        // next time, because it is already connected.
        this.testComplete();
    },
    /**
     * Used in the test to help identify where messages come from.
     * @returns {string}
     */
    getTestName: function() {
        return "Test Auth";
    }
});
/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestAuth = Class.create( TestBase, {
    getCloverConnectorListener: function(cloverConnector) {
        return new AuthExampleCloverConnectorListener(cloverConnector, progressinfoCallback);
    }
});

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
