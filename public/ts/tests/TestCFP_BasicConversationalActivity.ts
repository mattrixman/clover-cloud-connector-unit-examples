import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {ExampleCloverConnectorListener} from '../base/ExampleCloverConnectorListener';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestCFP_BasicConversationalActivity extends TestBase2 {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback);
    }

    /**
     *
     */
    public getName(): string {
        return "Test a basic conversational custom activity";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestCFP_BasicConversationalActivity.CloverConnectorListener = new TestCFP_BasicConversationalActivity.CloverConnectorListener(cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestCFP_BasicConversationalActivity {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        private action: string = "com.clover.cfp.examples.BasicConversationalExample";

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test using the Basic Custom conversational Activity on the device.";
        }

        public onCustomActivityResponse(response:sdk.remotepay.CustomActivityResponse):void {
            this.displayMessage({ message: "CustomActivityResponse.", response});
            if(this.action == response.getAction()) {
                this.testComplete(response.getSuccess());
            }
        }

        public onMessageFromActivity(response:sdk.remotepay.MessageFromActivity):void {
            this.displayMessage({ message: "MessageFromActivity.", response});
            if(this.action == response.getAction()) {
                let request:sdk.remotepay.MessageToActivity = new sdk.remotepay.MessageToActivity();
                request.setAction(this.action);
                request.setPayload(response.getPayload());
                this.cloverConnector.sendMessageToActivity(request);
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
            request.setPayload("This is the payload from the Clover Cloud Connector SDK");
            // request.setNonBlocking(); Leaving this as blocking for this example

            this.cloverConnector.startCustomActivity(request);
        }
    }
}

