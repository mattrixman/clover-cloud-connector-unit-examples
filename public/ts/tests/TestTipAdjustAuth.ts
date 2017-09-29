import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {ExampleCloverConnectorListener} from '../base/ExampleCloverConnectorListener';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestTipAdjustAuth extends TestBase2 {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback);
    }

    /**
     *
     */
    public getName(): string {
        return "Test adjusting an auth tip";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestTipAdjustAuth.CloverConnectorListener = new TestTipAdjustAuth.CloverConnectorListener(cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestTipAdjustAuth {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test adjusting an auth tip";
        }

        /**
         * @override
         */
        protected startTest(): void {
            super.startTest();
            /*
             The connector is ready, create a sale request and send it to the device.
             */
            let request:sdk.remotepay.AuthRequest = new sdk.remotepay.AuthRequest();
            request.setExternalId(Clover.CloverID.getNewId());
            request.setAmount(10);
            this.displayMessage({message: "Sending auth", request: request});
            this.cloverConnector.auth(request);
        }

        public onAuthResponse(response:sdk.remotepay.AuthResponse) {
            /*
             The auth is complete.  It might be canceled, or successful.  This can be determined by the
             values in the response.
             */
            this.displayMessage({message: "Auth response received", response: response});
            if (!response.getIsAuth()) {
                this.displayMessage({error: "Response is not an auth!"});
                this.testComplete(false);
                return;
            }
            let request:sdk.remotepay.TipAdjustAuthRequest = new sdk.remotepay.TipAdjustAuthRequest();
            request.setTipAmount(5);
            request.setOrderId(response.getPayment().getOrder().getId());
            request.setPaymentId(response.getPayment().getId());
            this.displayMessage({message: "Sending tip adjustment", request: request});
            this.cloverConnector.tipAdjustAuth(request);
        }

        public onTipAdjustAuthResponse(response:sdk.remotepay.TipAdjustAuthResponse) {
            this.displayMessage({message: "Tip adjust response received", response: response});
            // Always call this when your test is done, or the device may fail to connect the
            // next time, because it is already connected.
            this.testComplete(response.getSuccess());
        }
    }
}

