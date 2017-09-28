import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {ExampleCloverConnectorListener} from '../base/ExampleCloverConnectorListener';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestCapturePreAuth extends TestBase2 {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback);
    }

    /**
     *
     */
    public getName(): string {
        return "Test making a preAuth and capturing it";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestCapturePreAuth.CloverConnectorListener = new TestCapturePreAuth.CloverConnectorListener(cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestCapturePreAuth {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test making a preAuth and capturing it";
        }

        /**
         * @override
         */
        protected startTest(): void {
            super.startTest();
            /*
             The connector is ready, create a sale request and send it to the device.
             */
            let request:sdk.remotepay.PreAuthRequest = new sdk.remotepay.PreAuthRequest();
            request.setExternalId(Clover.CloverID.getNewId());
            request.setAmount(10);
            this.displayMessage({message: "Sending preauth", request: request});
            this.cloverConnector.auth(request);
        }

        public onPreAuthResponse(response:sdk.remotepay.PreAuthResponse) {
            /*
             The auth is complete.  It might be canceled, or successful.  This can be determined by the
             values in the response.
             */
            this.displayMessage({message: "PreAuth response received", response: response});
            if (!response.getIsPreAuth()) {
                this.displayMessage({error: "Response is not a preAuth!"});
                this.testComplete(false);
                return;
            }
            let request:sdk.remotepay.CapturePreAuthRequest = new sdk.remotepay.CapturePreAuthRequest();
            request.setAmount(1000);
            request.setTipAmount(100);
            request.setPaymentId(response.getPayment().getId());
            this.displayMessage({message: "Sending capture", request: request});
            this.cloverConnector.capturePreAuth(request);
        }

        public onCapturePreAuthResponse(response:sdk.remotepay.CapturePreAuthResponse) {
            this.displayMessage({message: "CapturePreAuth response received", response: response});
            // Always call this when your test is done, or the device may fail to connect the
            // next time, because it is already connected.
            this.testComplete(response.getSuccess());
        }
    }
}

