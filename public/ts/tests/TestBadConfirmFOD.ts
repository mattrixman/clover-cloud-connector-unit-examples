import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {ExampleCloverConnectorListener} from '../base/ExampleCloverConnectorListener';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestBadConfirmFOD extends TestBase2 {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback);
    }

    /**
     *
     */
    public getName(): string {
        return "Test erroring on the confirmation";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestBadConfirmFOD.CloverConnectorListener = new TestBadConfirmFOD.CloverConnectorListener(cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestBadConfirmFOD {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test an error when making a confirmation";
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

        /**
         * @override
         * @param response
         */
        public onSaleResponse(response:sdk.remotepay.SaleResponse) {
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
        }

        /**
         * @override
         * @param request
         */
        public onConfirmPaymentRequest(request: sdk.remotepay.ConfirmPaymentRequest): void {
            try{
                this.displayMessage({message: "Sending in bad payment to acceptPayment", request: request});
                let badPayment:sdk.payments.Payment = new sdk.payments.Payment();
                badPayment.setId("1234567890123");
                this.cloverConnector.acceptPayment(badPayment);
            } catch (e) {
                console.log(e);
                this.testComplete(false);
            }
        }
    }
}

