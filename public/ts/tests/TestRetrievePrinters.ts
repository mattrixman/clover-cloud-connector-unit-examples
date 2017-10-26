import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {ExampleCloverConnectorListener} from '../base/ExampleCloverConnectorListener';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestRetrievePrinters extends TestBase2 {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback);
    }

    /**
     *
     */
    public getName(): string {
        return "Test getting the list of printers from the device";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestRetrievePrinters.CloverConnectorListener = new TestRetrievePrinters.CloverConnectorListener(cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestRetrievePrinters {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test getting the list of printers from the device";
        }

        public onRetrievePrintersResponse(response: sdk.remotepay.RetrievePrintersResponse): void {
            this.displayMessage({message: "Response to getting printers", response});
            // Always call this when your test is done, or the device may fail to connect the
            // next time, because it is already connected.
            this.testComplete(response.getSuccess());
        }

        /**
         * @override
         */
        protected startTest(): void {
            super.startTest();
            /*
             The connector is ready, you can use it to communicate with the device.
             */
            this.displayMessage({message: "Call open cash drawer"});
            let request:sdk.remotepay.RetrievePrintersRequest = new sdk.remotepay.RetrievePrintersRequest();
            this.cloverConnector.retrievePrinters(request);
        }
    }
}

