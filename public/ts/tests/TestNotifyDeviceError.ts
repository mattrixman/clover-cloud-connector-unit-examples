import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {ExampleCloverConnectorListener} from '../base/ExampleCloverConnectorListener';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestNotifyDeviceError extends TestBase2 {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback);
    }

    /**
     *
     */
    public getName(): string {
        return "Test notifyDeviceError";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestNotifyDeviceError.CloverConnectorListener = new TestNotifyDeviceError.CloverConnectorListener(cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestNotifyDeviceError {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test notifyDeviceError";
        }

        /**
         * @override
         */
        protected startTest(): void {
            super.startTest();
            /*
             The connector is ready, you can use it to communicate with the device.
             */
            this.displayMessage({message: "Running notifyDeviceError"});
            (<Clover.CloverConnector>this.cloverConnector).notifyDeviceError(sdk.remotepay.ErrorType.EXCEPTION,
                sdk.remotepay.DeviceErrorEventCode.UnknownError,
                new Error(),
                "Testing message for notifyDeviceError");
            setTimeout(function () {
                // Always call this when your test is done, or the device may fail to connect the
                // next time, because it is already connected.
                this.testComplete(true);
            }.bind(this), 5000);
        }
    }
}

