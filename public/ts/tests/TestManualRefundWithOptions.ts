import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {ExampleCloverConnectorListener} from '../base/ExampleCloverConnectorListener';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestManualRefundWithOptions extends TestBase2 {

    private transactionSettings: sdk.remotepay.ManualRefundRequest;

    constructor(loader: CloverConfigLoader, progressInfoCallback: any, transactionSettings?: sdk.remotepay.ManualRefundRequest) {
        super(loader, progressInfoCallback);
        if (transactionSettings) {
            this.transactionSettings = transactionSettings;
        }
    }

    /**
     *
     */
    public getName(): string {
        return `Test making a manual refund with transaction options: ${JSON.stringify(this.transactionSettings, null, 1)}`;
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestManualRefundWithOptions.CloverConnectorListener = new TestManualRefundWithOptions.CloverConnectorListener(this.transactionSettings, cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestManualRefundWithOptions {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        private transactionSettings: sdk.remotepay.ManualRefundRequest;

        constructor(transactionSettings: sdk.remotepay.ManualRefundRequest, cloverConnector: sdk.remotepay.ICloverConnector, progressinfoCallback) {
            super(cloverConnector, progressinfoCallback);
            this.transactionSettings = transactionSettings;
        }

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return `Test making a manual refund with transaction options: ${JSON.stringify(this.transactionSettings, null, 1)}`;
        }

        /**
         * @override
         */
        protected startTest(): void {
            super.startTest();
            /*
             The connector is ready, create a sale request and send it to the device.
             */
            let request: sdk.remotepay.ManualRefundRequest = new sdk.remotepay.ManualRefundRequest();
            request = this.pullSettings(request);
            request.setAmount(2000);
            request.setExternalId(Clover.CloverID.getNewId());
            this.displayMessage({message: "Sending refund request", request: request});
            this.cloverConnector.manualRefund(request);
        }

        public onManualRefundResponse(response:sdk.remotepay.ManualRefundResponse) {
            this.displayMessage({message: "Refund response received", response: response});
            // Always call this when your test is done, or the device may fail to connect the
            // next time, because it is already connected.
            this.testComplete(response.getSuccess());
        }

        private pullSettings(request: sdk.remotepay.ManualRefundRequest): sdk.remotepay.ManualRefundRequest {
            if (this.transactionSettings) {
                for(let setting in this.transactionSettings) {
                    if (this.transactionSettings.hasOwnProperty(setting)) {
                        request['set' + setting.charAt(0).toUpperCase() + setting.slice(1)](this.transactionSettings[setting]);
                    }
                }
            }
            return request;
        }
    }
}

