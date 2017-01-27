var sdk = require("remote-pay-cloud-api");
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
var VaultCardExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
    ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
    this.cloverConnector = cloverConnector;
    this.progressinfoCallback = progressinfoCallback;
};

VaultCardExampleCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
VaultCardExampleCloverConnectorListener.prototype.constructor = VaultCardExampleCloverConnectorListener;

VaultCardExampleCloverConnectorListener.prototype.startTest = function () {
    ExampleCloverConnectorListener.prototype.startTest.call(this);
    /*
     The connector is ready, send the request to read card data to the device
     */
    this.displayMessage({message: "Sending request to vault a card"});

    // cardEntryMethods can be `ICC_CONTACT, MAG_STRIPE, NFC_CONTACTLESS` or some combination of those,
    // but not `MANUAL`
    this.cloverConnector.vaultCard(clover.CardEntryMethods.DEFAULT);
};

/**
 * Called in response to a readCardData(...) request
 * @memberof remotepay.ICloverConnectorListener
 *
 * @param response
 */
VaultCardExampleCloverConnectorListener.prototype.onReadCardDataResponse = function (response) {
    /*
     The read is complete complete.  It might be canceled, failed, or successful.  This can be determined by the
     values in the response.
     */
    this.displayMessage({message: "Read card data response received", response: response});
    // Always call this when your test is done, or the device may fail to connect the
    // next time, because it is already connected.
    this.testComplete(response.getSuccess());
};


/**
 * will be called at the completion of a vault card request, with either a SUCCESS or CANCEL code. If successful, the response will contain a payment with a token value unique for the card and merchant that can be used for future Sale or Auth requests.
 * @memberof remotepay.ICloverConnectorListener
 *
 * @param {remotepay.VaultCardResponse} response
 * @return void
 */
VaultCardExampleCloverConnectorListener.prototype.onVaultCardResponse = function(response) {
    var vaultedCard = response.getCard();

    this.displayMessage({message: "Vault card response received", response: response});

    // Always call this when your test is done, or the device may fail to connect the
    // next time, because it is already connected.
    this.testComplete(response.getSuccess());
};

/**
 * Used in the test to help identify where messages come from.
 * @returns {string}
 */
VaultCardExampleCloverConnectorListener.prototype.getTestName = function () {
    return "Test Vault Card";
};

/**
 * A very simple subclass of the tests that specifies the listener (see above)
 * that defines the test flow.
 * @type {TestBase}
 */
TestVaultCard = function (configUrl, friendlyName, progressinfoCallback) {
    TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
};

TestVaultCard.prototype = Object.create(TestBase.prototype);
TestVaultCard.prototype.constructor = TestVaultCard;

TestVaultCard.prototype.getCloverConnectorListener = function (cloverConnector) {
    return new VaultCardExampleCloverConnectorListener(cloverConnector, this.progressinfoCallback);
};

/**
 * Attach the test to the testbase to facilitate calling from the main page.
 * @param configUrl
 * @param progressinfoCallback
 */
TestBase.TestVaultCard = function (configUrl, progressinfoCallback) {
    var testObj = new TestVaultCard(configUrl, "test", progressinfoCallback);
    testObj.test();
};

if ('undefined' !== typeof module) {
    module.exports = TestVaultCard;
}
