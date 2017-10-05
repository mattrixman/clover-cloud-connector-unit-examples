import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';
import {ExampleCloverConnectorListener} from "../base/ExampleCloverConnectorListener";

export class TestTextPrint extends TestBase2 {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any, imageLocation?: string) {
        super(loader, progressInfoCallback);
    }

    /**
     *
     */
    public getName(): string {
        return "Test printText";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestTextPrint.CloverConnectorListener = new TestTextPrint.CloverConnectorListener(cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestTextPrint {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        constructor(cloverConnector: sdk.remotepay.ICloverConnector, progressinfoCallback) {
            super(cloverConnector, progressinfoCallback);
        }

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test printText";
        }

        /**
         * @override
         */
        protected startTest(): void {
            super.startTest();
            /*
             The connector is ready
             */
            this.displayMessage({message: "sending print request, will wait ten seconds"});
            this.cloverConnector.printText(["Test line 1", "Test line 2", "Test line 3", "Test line 4", "Test line 5", "Long Test line, Long Test line, Long Test line, Long Test line, Long Test line, Long Test line, Long Test line, Long Test line, Long Test line" ]);
        }

        public onPrintJobStatusResponse(response: sdk.remotepay.PrintJobStatusResponse) {
            this.displayMessage({message: "Got print job status", response});
            if (response && response.getStatus() && response.getStatus() == sdk.printer.PrintJobStatus.DONE) {
                this.testComplete(true);
            } else if(response && response.getStatus() && response.getStatus() == sdk.printer.PrintJobStatus.ERROR) {
                this.testComplete(false);
            }
        }
    }
}