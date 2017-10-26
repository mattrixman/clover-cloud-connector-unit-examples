import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';
import {ExampleCloverConnectorListener} from "../base/ExampleCloverConnectorListener";

export class TestPrintJobStatus extends TestBase2 {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any, imageLocation?: string) {
        super(loader, progressInfoCallback);
    }

    /**
     *
     */
    public getName(): string {
        return "Test getting the status of a print job";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestPrintJobStatus.CloverConnectorListener = new TestPrintJobStatus.CloverConnectorListener(cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestPrintJobStatus {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        private askedForStatus: boolean = false;
        private printRequestId: string;

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
            return "Test getting the status of a print job";
        }

        /**
         * @override
         */
        protected startTest(): void {
            super.startTest();
            /*
             The connector is ready
             */
            this.displayMessage({message: "sending print request"});
            this.printRequestId = Clover.CloverID.getNewId();
            let request: sdk.remotepay.PrintRequest = new sdk.remotepay.PrintRequest();
            request.setText(['This is a test of status']);
            request.setPrintRequestId(this.printRequestId);
            this.cloverConnector.print(request);
        }

        public onPrintJobStatusResponse(response: sdk.remotepay.PrintJobStatusResponse) {
            this.displayMessage({message: "Got pj status", response});
            if (!this.askedForStatus && response.getStatus() == sdk.printer.PrintJobStatus.DONE) {
                this.askedForStatus = true;
                setTimeout(function () {
                    let pjsr: sdk.remotepay.PrintJobStatusRequest = new sdk.remotepay.PrintJobStatusRequest();
                    pjsr.setPrintRequestId(this.printRequestId);
                    this.cloverConnector.retrievePrintJobStatus(this.printRequestId);
                }.bind(this), 1000);
            } else {
                setTimeout(function () {
                    this.testComplete(true);
                }.bind(this), 10000);
            }
        }
    }
}