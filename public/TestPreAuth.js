require("prototype");

// Following is in a separate file because it is used as a base for another test
var PreAuthExampleCloverConnectorListener = require("./PreAuthExampleCloverConnectorListener.js");
var TestBase = require("./TestBase.js");

/* Start: Test a preAuth */
/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestPreAuth = Class.create( TestBase, {
    getCloverConnectorListener: function(cloverConnector) {
        return new PreAuthExampleCloverConnectorListener(cloverConnector, progressinfoCallback);
    }
});

/**
 * Attach the test of a preAuth to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestPreAuth = function(configUrl, progressinfoCallback) {
    var testObj = new TestPreAuth(configUrl, "test", progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestPreAuth;
}
