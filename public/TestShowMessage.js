require("prototype");
var ExampleCloverConnectorListener = require("./ExampleCloverConnectorListener.js");
var TestBase = require("./TestBase.js");

var ShowMessageExampleCloverConnectorListener = Class.create( ExampleCloverConnectorListener, {
    onReady: function ($super, merchantInfo) {
        $super(merchantInfo);
        /*
         The connector is ready, create a sale request and send it to the device.
         */
        this.displayMessage({message: "Sending request to read card data"});
        this.cloverConnector.showMessage("This message was sent to this device from the test framework");
        setTimeout(function(){
            // Always call this when your test is done, or the device may fail to connect the
            // next time, because it is already connected.
            this.testComplete();
        }.bind(this), 5000);
    },

    /**
     * Used in the test to help identify where messages come from.
     * @returns {string}
     */
    getTestName: function() {
        return "Test Displaying a message on the device";
    }

});

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestShowMessage = Class.create( TestBase, {
    getCloverConnectorListener: function(cloverConnector) {
        return new ShowMessageExampleCloverConnectorListener(cloverConnector, progressinfoCallback);
    }
});

TestBase.TestShowMessage = function(configUrl, progressinfoCallback) {
    var testObj = new TestShowMessage(configUrl, "test", progressinfoCallback);
    testObj.test();
}