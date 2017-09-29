import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {ExampleCloverConnectorListener} from '../base/ExampleCloverConnectorListener';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestDisplayPaymentReceiptOptions extends TestBase2 {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback);
    }

    /**
     *
     */
    public getName(): string {
        return "Test making a sale and displaying payment receipt options";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestDisplayPaymentReceiptOptions.CloverConnectorListener = new TestDisplayPaymentReceiptOptions.CloverConnectorListener(cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestDisplayPaymentReceiptOptions {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        private saleComplete: boolean = false;

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test making a sale and displaying payment receipt options";
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
            let paymentId: string = response.getPayment().getId();
            let orderId: string = response.getPayment().getOrder().getId();
            this.cloverConnector.displayPaymentReceiptOptions(orderId, paymentId);

            this.saleComplete = response.getSuccess();
        }

        public onDeviceActivityEnd(deviceEvent:sdk.remotepay.CloverDeviceEvent): void {
            if (deviceEvent && deviceEvent.getEventState() == "RECEIPT_OPTIONS" && this.saleComplete) {
                //if leaving the receipt option screen and the sale is already completed, then you're done
                // Always call this when your test is done, or the device may fail to connect the
                // next time, because it is already connected.
                this.testComplete(this.saleComplete);
            }
        }
    }
}

