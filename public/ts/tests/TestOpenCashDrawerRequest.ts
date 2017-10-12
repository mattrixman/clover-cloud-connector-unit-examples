import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {ExampleCloverConnectorListener} from '../base/ExampleCloverConnectorListener';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestOpenCashDrawerRequest extends TestBase2 {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback);
    }

    /**
     *
     */
    public getName(): string {
        return "Test Opening each cash drawer on each printer.";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestOpenCashDrawerRequest.CloverConnectorListener = new TestOpenCashDrawerRequest.CloverConnectorListener(cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestOpenCashDrawerRequest {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test Opening each cash drawer on each printer.";
        }

        /**
         * @override
         */
        protected startTest(): void {
            super.startTest();
            /*
             The connector is ready, you can use it to communicate with the device.
             */
            this.displayMessage({message: "Call to get the list of printers."});
            let request:sdk.remotepay.RetrievePrintersRequest = new sdk.remotepay.RetrievePrintersRequest();
            this.cloverConnector.retrievePrinters(request);
        }

        public onRetrievePrintersResponse(response: sdk.remotepay.RetrievePrintersResponse): void {
            /*
             The connector is ready, you can use it to communicate with the device.
             */
            this.tryToOpenOneOfTheDrawers(response.getPrinters(), 0);
        }

        private tryToOpenOneOfTheDrawers(printers:Array<sdk.printer.Printer>, idx:number): void {
            if(idx < printers.length) {
                this.displayMessage({message: "Call open cash drawer"});
                let request:sdk.remotepay.OpenCashDrawerRequest = new sdk.remotepay.OpenCashDrawerRequest();
                request.setReason(`Test opening cash drawer with message, set printer to ${printers[idx]}`);
                request.setDeviceId(printers[idx].getId());
                this.cloverConnector.openCashDrawer(request);
                setTimeout(function () {
                    // Always call this when your test is done, or the device may fail to connect the
                    // next time, because it is already connected.
                    this.tryToOpenOneOfTheDrawers(printers, idx+1);
                }.bind(this), 5000);
            } else {
                this.testComplete(true);
            }
        }
    }
}

