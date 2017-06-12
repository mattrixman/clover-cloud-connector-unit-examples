import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {ExampleCloverConnectorListener} from '../base/ExampleCloverConnectorListener';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestCFP_BasicActivity extends TestBase2 {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback);
    }

    /**
     *
     */
    public getName(): string {
        return "Test a basic custom activity";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestCFP_BasicActivity.CloverConnectorListener = new TestCFP_BasicActivity.CloverConnectorListener(cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestCFP_BasicActivity {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        private action: string = "com.clover.cfp.examples.BasicExample";

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test using the Basic Custom Activity on the device.";
        }

        public onCustomActivityResponse(response:sdk.remotepay.CustomActivityResponse):void {
            this.displayMessage({ message: "CustomActivityResponse.", response});
            if(this.action == response.getAction()) {
                this.testComplete(response.getSuccess());
            }
        }

        /**
         * @override
         */
        protected startTest(): void {
            super.startTest();
            /*
             The connector is ready, you can use it to communicate with the device.
             */
            this.displayMessage({message: "Sending request to start Basic Activity"});
            let request: sdk.remotepay.CustomActivityRequest = new sdk.remotepay.CustomActivityRequest();
            request.setAction(this.action);
            // request.setPayload(); Payload is unused in this example
            // request.setNonBlocking(); Leaving this as blocking for this example

            this.cloverConnector.startCustomActivity(request);
        }
    }
}

