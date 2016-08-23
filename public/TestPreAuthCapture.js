require("prototype");
var PreAuthExampleCloverConnectorListener = require("./PreAuthExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("./TestBase.js");

/* Start: Test a preAuth, then capture it */
/**
 * A test of the preAuth + capture functionality.
 *
 * @type {ExampleCloverConnectorListener}
 */
var PreAuthCaptureExampleCloverConnectorListener = Class.create( PreAuthExampleCloverConnectorListener, {

    /**
     * Override of immediate super.
     * @param {clover.remotepay.PreAuthResponse} response
     */
    afterPreAuthResponse: function(response) {
        var capturePreAuthRequest = new clover.remotepay.CapturePreAuthRequest();
        capturePreAuthRequest.setAmount(101000);
        capturePreAuthRequest.setTipAmount(10100);
        capturePreAuthRequest.setPaymentId(response.getPayment().getId());
        this.displayMessage({message: "Sending capture preAuth", request: capturePreAuthRequest});
        this.cloverConnector.capturePreAuth(capturePreAuthRequest);
    },

    onCapturePreAuthResponse: function(response) {
        this.displayMessage({ message: "Capture PreAuth response received", response: response});
        if(!response.getSuccess()) {
            this.displayMessage({error: "Response was not successful!"});
            this.testComplete();
        } else if(response.getResult() != clover.remotepay.ResponseCode.SUCCESS) {
            this.displayMessage({error: "Response code is not SUCCESS!"});
            this.testComplete();
        }
        this.testComplete();
    },

    /**
     * Used in the test to help identify where messages come from.
     * @returns {string}
     */
    getTestName: function() {
        return "Test Pre Auth then capture";
    }
});
/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestPreAuthCapture = Class.create( TestBase, {
    getCloverConnectorListener: function(cloverConnector) {
        return new PreAuthCaptureExampleCloverConnectorListener(cloverConnector, progressinfoCallback);
    }
});

/**
 * Attach the test of a preAuth capture to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestPreAuthCapture = function(configUrl, progressinfoCallback) {
    var testObj = new TestPreAuthCapture(configUrl, "test", progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestPreAuthCapture;
}
