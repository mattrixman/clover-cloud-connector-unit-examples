import sdk = require("remote-pay-cloud-api");

/**
 * This is the base listener for the examples.
 *
 * @param cloverConnector
 * @param progressinfoCallback
 * @constructor
 */
export abstract class ExampleCloverConnectorListener
//implements
    extends
    sdk.remotepay.ICloverConnectorListener {

    protected cloverConnector: sdk.remotepay.ICloverConnector;
    private progressinfoCallback: any; // todo - type this later?
    private testStarted: boolean;


    constructor(cloverConnector: sdk.remotepay.ICloverConnector, progressinfoCallback) {
        super();

        this.cloverConnector = cloverConnector;
        this.progressinfoCallback = progressinfoCallback;
        this.testStarted = false;
    }

    /**
     * Call startTest() if not already flagged as a started test.
     * @param {sdk.remotepay.MerchantInfo} merchantInfo - information on supported operations, and configurations.
     */
    public onDeviceReady(merchantInfo: sdk.remotepay.MerchantInfo): void {
        this.displayMessage({message: "In onDeviceReady, starting test"});
        if(!this.testStarted) {
            this.startTest();
        }
    }
    /**
     * Flag the test as started.  Expected to be overridden to provide the meat of the test.  Called from the `onDeviceReady`
     * function if the test has not already been started.  If the overriding function does NOT call this, then additional
     * calls to `onDeviceReady` will result in additional calls to this function.
     */
    protected startTest(): void {
        this.testStarted = true;
    }

    /**
     * Send an automatic verification for all challenges.  If this is not implemented
     * the device will stay on the "Merchant is verifying your payment" screen.
     *
     * @override
     * @param {sdk.remotepay.ConfirmPaymentRequest} request
     * @return void
     */
    protected onConfirmPaymentRequest(request: sdk.remotepay.ConfirmPaymentRequest): void {
        this.displayMessage({message: "Automatically accepting payment", request: request});
        this.cloverConnector.acceptPayment(request.getPayment());
    }

    /**
     * Send an automatic verification for all signatures.  If this is not implemented
     * the device will stay on the "Merchant is verifying your signature" screen.
     *
     * @override
     * @param {sdk.remotepay.onVerifySignatureRequest} request
     * @return void
     */
    protected onVerifySignatureRequest(request: sdk.remotepay.onVerifySignatureRequest): void {
        this.displayMessage({message: "Automatically accepting signature", request: request});
        this.cloverConnector.acceptSignature(request);
    }

    /**
     * Dispose of the connector
     * @param success
     */
    protected testComplete(success: boolean): void {
        this.displayMessage({ message: "Test Completed.  Cleaning up.", success: success});
        this.cloverConnector.showWelcomeScreen();
        this.cloverConnector.dispose();
    }

    /**
     * Calls the passed progressinfoCallback with the passed message, decorating it with the test name.
     * @param message
     */
    protected displayMessage(message: any /* todo: Type this later */):void {
        if(message.hasOwnProperty('message') || message.hasOwnProperty('error')) {
            message.testName = this.getTestName();
        } else {
            message = {testName: this.getTestName(), message: message};
        }
        this.progressinfoCallback(message);
    }

    /**
     * Used to identify the test in progress messages.
     * @returns {string}
     */
    protected abstract getTestName(): string;

    /**
     * Will be called when an error occurs when trying to send messages to the device
     * @memberof remotepay.ICloverConnectorListener
     *
     * @override
     * @param {sdk.remotepay.CloverDeviceErrorEvent} deviceErrorEvent
     * @return void
     */
    protected onDeviceError(deviceErrorEvent: sdk.remotepay.CloverDeviceErrorEvent): void {
        console.error("onDeviceError", deviceErrorEvent);
        this.displayMessage({ message: "Test Error.", success: false, deviceErrorEvent});
        if (deviceErrorEvent.getType() == sdk.remotepay.ErrorType.EXCEPTION ) {
            setTimeout(function () {
                // Always call this when your test is done, or the device may fail to connect the
                // next time, because it is already connected.
                this.testComplete(false);
            }.bind(this), 5000);
        }
    }
}
