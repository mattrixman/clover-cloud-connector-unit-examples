import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';
import {ExampleCloverConnectorListener} from "../base/ExampleCloverConnectorListener";

export class TestPrint extends TestBase2 {

    private image: any;
    private url: string[];
    private text: string[];

    constructor(loader: CloverConfigLoader, progressInfoCallback: any, image?: any, url?: string[], text?: string[]) {
        super(loader, progressInfoCallback);
        if(image) {
            this.image = image;
        } else {
            this.image = null;
        }
        if(url) {
            this.url = url;
        } else {
            this.url = null;
        }
        if(text) {
            this.text = text;
        } else {
            this.text = null;
        }
    }

    /**
     *
     */
    public getName(): string {
        return "Test print: " + this.image + " " + this.url + " " + this.text;
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestPrint.CloverConnectorListener = new TestPrint.CloverConnectorListener(
            this.image, this.url, this.text, cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestPrint {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        private image: any;
        private url: string[];
        private text: string[];

        constructor(image: string[], url: string[], text: string[], cloverConnector: sdk.remotepay.ICloverConnector, progressinfoCallback) {
            super(cloverConnector, progressinfoCallback);
            this.image = image;
            this.url = url;
            this.text = text;
        }

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test print: " + this.image + " " + this.url + " " + this.text;
        }

        /**
         * @override
         */
        protected startTest(): void {
            super.startTest();
            /*
             The connector is ready
             */
            if (this.image && this.image.length > 0) {
                this.displayMessage({message: "Loading image(s)..." +this.image.length});
                let images = [];
                let loaded = 0;
                for (let i = 0; i < this.image.length; i++){
                    images[i] = new Image;
                    images[i].onload = function () {
                        loaded++;
                        if (loaded >= this.image.length) {
                            let request: sdk.remotepay.PrintRequest = new sdk.remotepay.PrintRequest();
                            request.setImage(images);
                            request.setImageUrl(this.url);
                            request.setText(this.text);
                            this.displayMessage({message: "Image(s) loaded, sending print request", request: request});
                            this.cloverConnector.print(request);
                        }
                    }.bind(this);
                    images[i].src = this.image[i];
                }
            } else {
                let request: sdk.remotepay.PrintRequest = new sdk.remotepay.PrintRequest();
                request.setImage(this.image);
                request.setImageUrl(this.url);
                request.setText(this.text);
                this.displayMessage({message: "Sending print request", request: request});
                this.cloverConnector.print(request);
            }
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