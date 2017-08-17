import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';
import {ExampleCloverConnectorListener} from "../base/ExampleCloverConnectorListener";

export class TestImageUrlPrint extends TestBase2 {

    private imageLocation:string;

    constructor(loader: CloverConfigLoader, progressInfoCallback: any, imageLocation?: string) {
        super(loader, progressInfoCallback);
        if(!imageLocation) {
            this.imageLocation = "/images/test_receipt_6.jpg";
        } else {
            this.imageLocation = imageLocation;
        }
    }

    /**
     *
     */
    public getName(): string {
        return "Test printing " + this.imageLocation + " from url";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestImageUrlPrint.CloverConnectorListener = new TestImageUrlPrint.CloverConnectorListener(
            this.imageLocation, cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestImageUrlPrint {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        private imageLocation: string;

        constructor(imageLocation: string, cloverConnector: sdk.remotepay.ICloverConnector, progressinfoCallback) {
            super(cloverConnector, progressinfoCallback);
            this.imageLocation = imageLocation;
        }

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test printing " + this.imageLocation + " from url";
        }

        /**
         * @override
         */
        protected startTest(): void {
            super.startTest();
            /*
             The connector is ready
             */
            this.displayMessage({message: "Sending print request"});
            this.cloverConnector.printImageFromURL(window.location.origin + this.imageLocation);
            this.testComplete(true);
        }
    }
}