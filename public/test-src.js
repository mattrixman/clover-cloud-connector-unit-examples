require("prototype");
var $ = require('jQuery');
SimpleCloverConfig = require("./SimpleCloverConfig");

var clover = require("remote-pay-cloud");
var log = clover.Logger.create();
var simpleCloverConfig = new SimpleCloverConfig(log);

TestBase = Class.create( {
    initialize: function(simpleCloverConfig, configUrl, friendlyName, progressinfoCallback) {
        this.simpleCloverConfig = simpleCloverConfig;
        this.configUrl = configUrl;
        this.friendlyName = friendlyName;
        this.progressinfoCallback = progressinfoCallback;
    },

    test: function() {
        this.displayMessage({message: "About to load configuration..."});
        this.simpleCloverConfig.loadCloverConfig(this.configUrl, {friendlyId: this.friendlyName}, this.readyTest.bind(this));
    },

    readyTest: function(error, configuration) {
        if(error) {
            this.displayMessage({type:"error", message: error});
        } else {
            this.displayMessage({type:"success", message: configuration});
            configuration = this.decorateConfiguration(configuration);
            this.connector = new clover.CloverConnectorFactory().createICloverConnector(configuration);
            var connectorListener = this.getCloverConnectorListener(this.connector, this.progressinfoCallback);
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
    },

    displayMessage: function(message) {
        log.info(message);
        if(this.progressinfoCallback) {
            this.progressinfoCallback(message);
        }
    },

    /**
     * Add any values to the configuration that we need to for the test.
     * @param configuration
     */
    decorateConfiguration: function(configuration) {
        configuration.friendlyId = this.friendlyName;
        return configuration;
    },

    /**
     * abstract
     * Implement for each specific test.
     */
    getCloverConnectorListener: function(cloverConnector, progressinfoCallback) {
        return null;
    }
});

TestBase.saveConfig = function(configUrl, configuration, callback) {
    simpleCloverConfig.saveCloverConfig(configUrl, configuration, callback);
};

var ExampleCloverConnectorListener = Class.create( clover.remotepay.ICloverConnectorListener, {
    initialize: function (cloverConnector, progressinfoCallback) {
        this.cloverConnector = cloverConnector;
        this.progressinfoCallback = progressinfoCallback;
    },
    onReady: function (merchantInfo) {
        this.displayMessage({message: "In onReady, starting test"});
    },
    onConfirmPaymentRequest: function(request) {
        /*
         Just send an automatic verification for all challenges.  If this is not implemented
         the device will stay on the "Merchant is verifying your payment" screen.
         */
        this.displayMessage({message: "Automatically accepting payment", request: request});
        this.cloverConnector.acceptPayment(request.getPayment());
    },
    onVerifySignatureRequest: function (request) {
        /*
         Just send an automatic verification for all signatures.  If this is not implemented
         the device will stay on the "Merchant is verifying your signature" screen.
         */
        this.displayMessage({message: "Automatically accepting signature", request: request});
        this.cloverConnector.acceptSignature(request);
    },
    testComplete: function () {
        this.displayMessage({ message: "Test Completed.  Cleaning up."});
        this.cloverConnector.dispose();
    },
    displayMessage: function(message) {
        this.progressinfoCallback({testName: this.getTestName(), message: message});
    },
    getTestName: function() {
        return "Sale Test";
    }
});

/* Start: Test a sale */
/**
 * A test of the sale functionality.
 *
 * @type {ExampleCloverConnectorListener}
 */
var SaleExampleCloverConnectorListener = Class.create( ExampleCloverConnectorListener, {
    onReady: function ($super, merchantInfo) {
        $super(merchantInfo);
        /*
        The connector is ready, create a sale request and send it to the device.
         */
        var saleRequest = new clover.remotepay.SaleRequest();
        saleRequest.setExternalId(clover.CloverID.getNewId());
        saleRequest.setAmount(10000);
        this.displayMessage({message: "Sending sale", request: saleRequest});
        this.cloverConnector.sale(saleRequest);
    },
    onSaleResponse: function (response) {
        /*
        The sale is complete.  It might be canceled, or successful.  This can be determined by the
        values in the response.
         */
        this.displayMessage({ message: "Sale response received", response: response});
        if(!response.getIsSale()) {
            this.displayMessage({error: "Response is not an sale!"});
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
        return "Sale Test";
    }
});
/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestSale = Class.create( TestBase, {
    getCloverConnectorListener: function(cloverConnector) {
        return new SaleExampleCloverConnectorListener(cloverConnector, progressinfoCallback);
    }
});

/**
 * Attach the test of a sale to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.testSale = function(configUrl, progressinfoCallback) {
    var testSaleObj = new TestSale(simpleCloverConfig, configUrl, "test", progressinfoCallback);
    testSaleObj.test();
};
/* End: Test a sale */

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
        return "Auth Test";
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
TestBase.testAuth = function(configUrl, progressinfoCallback) {
    var testSaleObj = new TestAuth(simpleCloverConfig, configUrl, "test", progressinfoCallback);
    testSaleObj.test();
};
/* End: Test a sale */

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
        } else if(response.getResult() != clover.remotepay.ResponseCode.SUCCESS) {
            this.displayMessage({error: "Response code is not SUCCESS!"});
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
        return "PreAuth Test";
    }
});
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
TestBase.testPreAuth = function(configUrl, progressinfoCallback) {
    var testObj = new TestPreAuth(simpleCloverConfig, configUrl, "test", progressinfoCallback);
    testObj.test();
};
/* End: Test a preAuth */

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
        capturePreAuthRequest.setExternalId(clover.CloverID.getNewId());
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
        } else if(response.getResult() != remotepay.ResponseCode.SUCCESS) {
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
        return "Capture PreAuth Test";
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
TestBase.testPreAuthCapture = function(configUrl, progressinfoCallback) {
    var testObj = new TestPreAuthCapture(simpleCloverConfig, configUrl, "test", progressinfoCallback);
    testObj.test();
};
/* End: Test a preAuth */


if ('undefined' !== typeof module) {
    module.exports = TestBase;
}
