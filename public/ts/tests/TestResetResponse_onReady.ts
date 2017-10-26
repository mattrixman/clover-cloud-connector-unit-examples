import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {ExampleCloverConnectorListener} from '../base/ExampleCloverConnectorListener';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestResetResponse_onReady extends TestBase2 {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback);
    }

    /**
     *
     */
    public getName(): string {
        return "Test resetting the device and getting a response";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestResetResponse_onReady.CloverConnectorListener = new TestResetResponse_onReady.CloverConnectorListener(cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestResetResponse_onReady {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test resetting the device immediately";
        }

        /**
         * @override
         */
        protected startTest(): void {
            super.startTest();

            // Should not get here.
            // Reset Device
            this.cloverConnector.resetDevice();
        }

        /**
         * Call startTest() if not already flagged as a started test.
         * @param {sdk.remotepay.MerchantInfo} merchantInfo - information on supported operations, and configurations.
         */
        public onDeviceReady(merchantInfo: sdk.remotepay.MerchantInfo): void {
            // Reset Device
            this.cloverConnector.resetDevice();
        }

        /*
         This is where we will call the callback that was just set up from one of the above.
         */
        public onResetDeviceResponse(response: sdk.remotepay.ResetDeviceResponse): void {
            this.displayMessage({message: "Reset device response", response});
            this.testComplete(true);
            return;
        }
    }
}

