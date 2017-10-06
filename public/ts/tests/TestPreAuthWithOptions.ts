import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {ExampleCloverConnectorListener} from '../base/ExampleCloverConnectorListener';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestPreAuthWithOptions extends TestBase2 {

    private transactionSettings: sdk.remotepay.PreAuthRequest;

    constructor(loader: CloverConfigLoader, progressInfoCallback: any, transactionSettings?: sdk.remotepay.PreAuthRequest) {
        super(loader, progressInfoCallback);
        if (transactionSettings) {
            this.transactionSettings = transactionSettings;
        }
    }

    /**
     *
     */
    public getName(): string {
        return `Test making a PreAuth with transaction options: ${JSON.stringify(this.transactionSettings, null, 1)}`;
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestPreAuthWithOptions.CloverConnectorListener = new TestPreAuthWithOptions.CloverConnectorListener(this.transactionSettings, cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestPreAuthWithOptions {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        private transactionSettings: sdk.remotepay.PreAuthRequest;

        constructor(transactionSettings: sdk.remotepay.PreAuthRequest, cloverConnector: sdk.remotepay.ICloverConnector, progressinfoCallback) {
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
            return "Test making an PreAuth with transaction options";
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
            request = this.pullSettings(request);
            this.displayMessage({message: "Sending PreAuth", request: request});
            this.cloverConnector.preAuth(request);
        }

        public onPreAuthResponse(response:sdk.remotepay.PreAuthResponse) {
            /*
             The PreAuth is complete.  It might be canceled, or successful.  This can be determined by the
             values in the response.
             */
            this.displayMessage({message: "PreAuth response received", response: response});
            if (!response.getIsPreAuth()) {
                this.displayMessage({error: "Response is not a PreAuth!"});
                this.testComplete(false);
                return;
            }
            // Always call this when your test is done, or the device may fail to connect the
            // next time, because it is already connected.
            this.testComplete(response.getSuccess());
        }

        private pullSettings(request: sdk.remotepay.PreAuthRequest): sdk.remotepay.PreAuthRequest {
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

