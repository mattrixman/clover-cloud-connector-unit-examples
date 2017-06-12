import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {ExampleCloverConnectorListener} from '../base/ExampleCloverConnectorListener';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestState extends TestBase2 {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback);
    }

    /**
     *
     */
    public getName(): string {
        return "Test asking the device for it's current state";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestState.CloverConnectorListener = new TestState.CloverConnectorListener(cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestState {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        private nextAction;

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test making a sale";
        }

        /**
         * @override
         */
        protected startTest(): void {
            super.startTest();
            /*
             The connector is ready, create a sale request and send it to the device.
             */
            let saleRequest:sdk.remotepay.SaleRequest = new sdk.remotepay.SaleRequest();
            saleRequest.setExternalId(Clover.CloverID.getNewId());
            saleRequest.setAmount(10);
            this.displayMessage({message: "Sending sale", request: saleRequest});
            this.cloverConnector.sale(saleRequest);
        }

        /*
        The pattern here is to override the callback, and instead of continuing the flow as usual,
        call the retrieveDeviceStatus instead.  Set up a callback that would be the typical flow
        that would occur if we were NOT asking for the status.  This callback will then be invoked when
        the callback for the status is invoked.  The callbacks are bound to the context of the current
        object
         */

        public onSaleResponse(response:sdk.remotepay.SaleResponse) {

            // Ask for status
            let statusRequest: sdk.remotepay.RetrieveDeviceStatusRequest = new sdk.remotepay.RetrieveDeviceStatusRequest();
            statusRequest.setSendLastMessage(true);
            this.cloverConnector.retrieveDeviceStatus(statusRequest);

            // Set up the callback
            this.nextAction = function () {
                /*
                 The sale is complete.  It might be canceled, or successful.  This can be determined by the
                 values in the response.
                 */
                this.displayMessage({message: "Sale response received", response: response});
                if (!response.getIsSale()) {
                    this.displayMessage({error: "Response is not a sale!"});
                    this.testComplete(false);
                    return;
                }
                // Always call this when your test is done, or the device may fail to connect the
                // next time, because it is already connected.
                this.testComplete(response.getSuccess());
            }.bind(this);
        }

        /**
         * Call startTest() if not already flagged as a started test.
         * @param {sdk.remotepay.MerchantInfo} merchantInfo - information on supported operations, and configurations.
         */
        protected onReady(merchantInfo: sdk.remotepay.MerchantInfo): void {

            // Ask for status
            let statusRequest: sdk.remotepay.RetrieveDeviceStatusRequest = new sdk.remotepay.RetrieveDeviceStatusRequest();
            statusRequest.setSendLastMessage(true);
            this.cloverConnector.retrieveDeviceStatus(statusRequest);

            // Set up the callback
            this.nextAction = function () {
                if(!this.testStarted) {
                    this.startTest();
                }
            }.bind(this);
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

            // Ask for status
            let statusRequest: sdk.remotepay.RetrieveDeviceStatusRequest = new sdk.remotepay.RetrieveDeviceStatusRequest();
            statusRequest.setSendLastMessage(true);
            this.cloverConnector.retrieveDeviceStatus(statusRequest);

            // Set up the callback
            this.nextAction = function () {
                this.cloverConnector.acceptPayment(request.getPayment());
            }.bind(this);
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
            // Ask for status
            let statusRequest: sdk.remotepay.RetrieveDeviceStatusRequest = new sdk.remotepay.RetrieveDeviceStatusRequest();
            statusRequest.setSendLastMessage(true);
            this.cloverConnector.retrieveDeviceStatus(statusRequest);

            // Set up the callback
            this.nextAction = function () {
                this.cloverConnector.acceptSignature(request);
            }.bind(this);
        }

        protected onTipAdded(response: sdk.remotepay.TipAdded): void {
            // Ask for status
            let statusRequest: sdk.remotepay.RetrieveDeviceStatusRequest = new sdk.remotepay.RetrieveDeviceStatusRequest();
            statusRequest.setSendLastMessage(true);
            this.cloverConnector.retrieveDeviceStatus(statusRequest);

            // Set up the callback
            this.nextAction = function () {
                this.displayMessage({message: "This is the callback from onTipAdded", response});
            }.bind(this);
        }

        /*
        This is where we will call the callback that was just set up from one of the above.
         */
        protected onRetrieveDeviceStatusResponse(response: sdk.remotepay.RetrieveDeviceStatusResponse): void {
            this.displayMessage({message: "Device status", response});
            if(this.nextAction) {
                this.nextAction();
                this.nextAction = null;
            }
        }
    }
}

