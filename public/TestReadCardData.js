require("prototype");
var ExampleCloverConnectorListener = require("./ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");
var TestBase = require("./TestBase.js");


/**
 * A test of the read card data functionality.
 *
 * @since 1.1.0-RC2
 *
 * @type {ExampleCloverConnectorListener}
 */
var ReadCardDataExampleCloverConnectorListener = Class.create( ExampleCloverConnectorListener, {
    onReady: function ($super, merchantInfo) {
        $super(merchantInfo);
        /*
         The connector is ready, send the request to read card data to the device
         */
        this.displayMessage({message: "Sending request to read card data"});

        var readCardDataRequest = new clover.remotepay.ReadCardDataRequest();
        readCardDataRequest.setIsForceSwipePinEntry(false);
        // cardEntryMethods can be `ICC_CONTACT, MAG_STRIPE, NFC_CONTACTLESS` or some combination of those,
        // but not `MANUAL`
        readCardDataRequest.setCardEntryMethods(clover.CardEntryMethods.DEFAULT);
        this.cloverConnector.readCardData(readCardDataRequest);
    },

    /**
     * Called in response to a readCardData(...) request
     * @memberof remotepay.ICloverConnectorListener
     *
     * @param {remotepay.ReadCardDataResponse} response
     * @return {Null}
     */
    onReadCardDataResponse: function (response) {
        /*
         The read is complete complete.  It might be canceled, failed, or successful.  This can be determined by the
         values in the response.
         */
        this.displayMessage({ message: "Read card data response received", response: response});
        // Always call this when your test is done, or the device may fail to connect the
        // next time, because it is already connected.
        this.testComplete();
    },

    /**
     * Used in the test to help identify where messages come from.
     * @returns {string}
     */
    getTestName: function() {
        return "Test Read Card Data";
    }
});

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestReadCardData = Class.create( TestBase, {
    getCloverConnectorListener: function(cloverConnector) {
        return new ReadCardDataExampleCloverConnectorListener(cloverConnector, progressinfoCallback);
    }
});

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestReadCardData = function(configUrl, progressinfoCallback) {
    var testObj = new TestReadCardData(configUrl, "test", progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestReadCardData;
}
