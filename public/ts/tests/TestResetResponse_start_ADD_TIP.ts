import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {ExampleCloverConnectorListener} from '../base/ExampleCloverConnectorListener';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestResetResponse_start_ADD_TIP extends TestBase2 {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback);
    }

    /**
     *
     */
    public getName(): string {
        return "Test resetting the device after a sale is started, and getting a response";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestResetResponse_start_ADD_TIP.CloverConnectorListener = new TestResetResponse_start_ADD_TIP.CloverConnectorListener(cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestResetResponse_start_ADD_TIP {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test resetting the device after a sale is started";
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

        protected onDeviceActivityStart( deviceEvent: sdk.remotepay.CloverDeviceEvent): void {
            if (deviceEvent.getEventState() == sdk.remotepay.DeviceEventState.ADD_TIP) {
                this.cloverConnector.resetDevice();
            }
        }

        /*
         This is where we will call the callback that was just set up from one of the above.
         */
        protected onResetDeviceResponse(response: sdk.remotepay.ResetDeviceResponse): void {
            this.displayMessage({message: "Reset device response", response});
            this.testComplete(true);
            return;
        }
    }
}

