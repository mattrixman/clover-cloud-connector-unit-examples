require("prototype");
var ExampleCloverConnectorListener = require("./ExampleCloverConnectorListener.js");
var clover = require("remote-pay-cloud");

/* Start: Test a preAuth */
/**
 * A test of the preAuth functionality.
 *
 * @type {ExampleCloverConnectorListener}
 */
var PreAuthExampleCloverConnectorListener = Class.create( ExampleCloverConnectorListener, {
    onReady: function ($super, merchantInfo) {
        $super(merchantInfo);
        /*
         The connector is ready, create a preAuth request and send it to the device.
         */
        var preAuthRequest = new clover.remotepay.PreAuthRequest();
        preAuthRequest.setExternalId(clover.CloverID.getNewId());
        preAuthRequest.setAmount(10010);
        this.displayMessage({message: "Sending preAuth", request: preAuthRequest});
        this.cloverConnector.preAuth(preAuthRequest);
    },
    onPreAuthResponse: function (response) {
        /*
         The preAuth is complete.  It might be canceled, or successful.  This can be determined by the
         values in the response.
         */
        this.displayMessage({ message: "PreAuth response received", response: response});
        if(!response.getIsPreAuth()) {
            this.displayMessage({error: "Response is not a preAuth!"});
        } else if(!response.getSuccess()) {
            this.displayMessage({error: "Response was not successful!"});
            this.testComplete();
        } else if(response.getResult() && (response.getResult() != clover.remotepay.ResponseCode.SUCCESS)) {
            this.displayMessage({error: "Response code is not SUCCESS! It is " + response.getResult()});
            this.testComplete();
        }
        this.afterPreAuthResponse(response);
    },

    afterPreAuthResponse: function(response) {
        // Always call this when your test is done, orthe device may fail to connect the
        // next time, because it is already connected.
        this.testComplete();
    },

    /**
     * Used in the test to help identify where messages come from.
     * @returns {string}
     */
    getTestName: function() {
        return "Test Pre Auth";
    }
});

if ('undefined' !== typeof module) {
    module.exports = PreAuthExampleCloverConnectorListener;
}
