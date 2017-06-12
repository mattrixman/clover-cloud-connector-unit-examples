import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {ExampleCloverConnectorListener} from '../base/ExampleCloverConnectorListener';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestCFP_RatingsActivity extends TestBase2 {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback);
    }

    /**
     *
     */
    public getName(): string {
        return "Test a ratings custom activity";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestCFP_RatingsActivity.CloverConnectorListener = new TestCFP_RatingsActivity.CloverConnectorListener(cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

class PayloadMessage {
    public payloadClassName:string;
    public messageType:string;

    constructor(payloadClassName:string, messageType:string) {
        if (!payloadClassName) {
            this.payloadClassName = "PayloadMessage";
        } else {
            this.payloadClassName = payloadClassName;
        }
        this.messageType = messageType;
    }
}

class MessageType {
    public static RATINGS:string = "RATINGS";
    public static CUSTOMER_INFO:string = "CUSTOMER_INFO";
    public static PHONE_NUMBER:string = "PHONE_NUMBER";
    public static REQUEST_RATINGS:string = "REQUEST_RATINGS";
}

class Rating {
    public id:string;
    public question:string;
    public value:number
}


class RatingsMessage extends PayloadMessage {
    public ratings:Rating[];
    constructor(ratings:Rating[]) {
        super("RatingsMessage", MessageType.RATINGS);
        this.ratings = ratings;
    }
}

class CustomerInfo {
    public phoneNumber:string;
    public customerName:string;
}

class CustomerInfoMessage extends PayloadMessage {
    public customerInfo:CustomerInfo;

    constructor(customerInfo: CustomerInfo) {
        super("CustomerInfoMessage", MessageType.CUSTOMER_INFO);
        this.customerInfo = customerInfo;
    }
}

class PhoneNumberMessage extends PayloadMessage{
    public phoneNumber:string;
    constructor(phoneNumber:string) {
        super("PhoneNumberMessage", MessageType.PHONE_NUMBER);
        this.phoneNumber = phoneNumber;
    }
}

export namespace TestCFP_RatingsActivity {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        private action: string = "com.clover.cfp.examples.RatingsExample";
        private actionFromActivity:string = this.action + ".MessageFromActivity";
        private actionToActivity:string =   this.action;

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test using the Custom Ratings Activity on the device.";
        }

        public onCustomActivityResponse(response:sdk.remotepay.CustomActivityResponse):void {
            this.displayMessage({ message: "CustomActivityResponse.", response});
            if(this.action == response.getAction()) {
                this.testComplete(response.getSuccess());
            }
        }

        public onMessageFromActivity(response:sdk.remotepay.MessageFromActivity):void {
            this.displayMessage({ message: "MessageFromActivity.", response});
            if(this.actionFromActivity == response.getAction()) {
                let payloadObj:Object = JSON.parse(response.getPayload());

                if(payloadObj.hasOwnProperty("messageType")) {
                    let messageType:string = payloadObj["messageType"];
                    switch(messageType) {
                        case MessageType.PHONE_NUMBER:
                            if(payloadObj.hasOwnProperty("phoneNumber")) {
                                // Simulate a customer lookup based on the phone number
                                let customer:CustomerInfo = new CustomerInfo();
                                customer.customerName = "John Smith";
                                customer.phoneNumber = payloadObj["phoneNumber"];
                                let customerMessage:CustomerInfoMessage = new CustomerInfoMessage(customer);

                                this.sendMessage(customerMessage);
                            } else {
                                this.displayMessage({ message: "No phone number entered!"});
                            }
                            break;
                        case MessageType.CUSTOMER_INFO:
                            // Sent to the device
                            break;
                        case MessageType.RATINGS:
                            // Sent to the device
                            break;
                        case MessageType.REQUEST_RATINGS:
                            let ratingSet:Rating[] = new Array(3);
                            ratingSet[0] = new Rating();
                            ratingSet[0].id = "cleanliness";
                            ratingSet[0].question = "How clean was your room?";

                            ratingSet[1] = new Rating();
                            ratingSet[1].id = "amenities";
                            ratingSet[1].question = "Was there enough supplies in your room?";

                            ratingSet[2] = new Rating();
                            ratingSet[2].id = "overall";
                            ratingSet[2].question = "How satisfied were you overall?";

                            let request:RatingsMessage = new RatingsMessage(ratingSet);
                            this.sendMessage(request);
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        private sendMessage(payloadMessage:PayloadMessage): void {
            let request:sdk.remotepay.MessageToActivity = new sdk.remotepay.MessageToActivity();
            request.setAction(this.actionToActivity);
            request.setPayload(JSON.stringify(payloadMessage));
            this.cloverConnector.sendMessageToActivity(request);
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

