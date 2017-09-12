import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {ExampleCloverConnectorListener} from '../base/ExampleCloverConnectorListener';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestBadIDRetrievePrintJobStatus extends TestBase2 {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback);
    }

    /**
     *
     */
    public getName(): string {
        return "Test getting the status of a print job that does not exist";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestBadIDRetrievePrintJobStatus.CloverConnectorListener = new TestBadIDRetrievePrintJobStatus.CloverConnectorListener(cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestBadIDRetrievePrintJobStatus {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        private askedForStatus:boolean = false;

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test getting the status of a print job that does not exist";
        }

        protected onPrintJobStatusResponse(response: sdk.remotepay.PrintJobStatusResponse): void {
            this.displayMessage({message: "Print job status received...", response});
            if (
                this.askedForStatus && // we are not even going to try to quit until we actually ASK for the status.
                    // status will be returned any time they change.
                (
                    response.getStatus() == sdk.printer.PrintJobStatus.DONE ||
                    response.getStatus() == sdk.printer.PrintJobStatus.ERROR || // can get multiples of this - should we bail out here?
                                                                                // do we get a 'DONE' if it gets removed from the queue?
                    response.getStatus() == sdk.printer.PrintJobStatus.UNKNOWN || // not sure this even comes back right now - future use
                    response.getStatus() == sdk.printer.PrintJobStatus.NOT_FOUND // not sure this even comes back right now - future use
                )
            ) {
                // Always call this when your test is done, or the device may fail to connect the
                // next time, because it is already connected.
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
            let badId:string = Clover.CloverID.getNewId();
            let pjsr:sdk.remotepay.PrintJobStatusRequest = new sdk.remotepay.PrintJobStatusRequest();
            pjsr.setPrintRequestId(badId);
            this.cloverConnector.retrievePrintJobStatus(pjsr);
            this.askedForStatus = true;
        }
    }
}

