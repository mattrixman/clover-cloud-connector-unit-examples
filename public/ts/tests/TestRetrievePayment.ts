import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {ExampleCloverConnectorListener} from '../base/ExampleCloverConnectorListener';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestRetrievePayment extends TestBase2 {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback);
    }

    /**
     *
     */
    public getName(): string {
        return "Test getting a payment by external id";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestRetrievePayment.CloverConnectorListener = new TestRetrievePayment.CloverConnectorListener(cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestRetrievePayment {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        private externalId:string;

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test getting a payment by external id";
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
            this.externalId = Clover.CloverID.getNewId();
            saleRequest.setExternalId(this.externalId);
            saleRequest.setAmount(10);
            this.displayMessage({message: "Sending sale", request: saleRequest});
            this.cloverConnector.sale(saleRequest);
        }

        public onSaleResponse(response:sdk.remotepay.SaleResponse) {
            /*
             The sale is complete.  It might be canceled, or successful.  This can be determined by the
             values in the response.
             */
            this.displayMessage({message: "Sale response received", response: response});
            if (!response.getIsSale()) {
                this.displayMessage({error: "Response is not a sale!  Will try to continue"});
            }

            let retrievePaymentRequest:sdk.remotepay.RetrievePaymentRequest = new sdk.remotepay.RetrievePaymentRequest();
            retrievePaymentRequest.setExternalPaymentId(this.externalId);
            this.cloverConnector.retrievePayment(retrievePaymentRequest);
        }

        public onRetrievePaymentResponse(response:sdk.remotepay.RetrievePaymentResponse) {

            if (response.getPayment()) {
                this.displayMessage({message: "Got a payment!", payment: response.getPayment()});
            }

            // Always call this when your test is done, or the device may fail to connect the
            // next time, because it is already connected.
            this.testComplete(response.getSuccess());
        }
    }
}

