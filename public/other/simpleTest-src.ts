// Example of paired connection
var $ = require('jquery');
import * as Clover from 'remote-pay-cloud';

// This is a hardcoded configuration to create a connector that communicates directly with a device.
export class StandAloneExampleWebsocketPairedCloverDeviceConfiguration extends Clover.WebSocketPairedCloverDeviceConfiguration {

    public constructor() {
        super(
            "wss://Clover-C030UQ50550081.local.:12345/remote_pay", //uri,
            "test.js.test", // appId,
            "My_Pos_System", // posName,
            "8675309142856", // serialNumber,
            null, // authToken,
            Clover.BrowserWebSocketImpl.createInstance // Since we are doing this in a browser, use this
        );
    }

    public onPairingCode(pairingCode: string): void {
        console.log("Pairing code is " + pairingCode + " you will need to enter this on the device."); // You will need to enter this code into the device
    }

    public onPairingSuccess(authToken: string): void {
        // you could use this authToken to create future 'StandAloneExampleWebsocketPairedCloverDeviceConfiguration'
        // that would not have to be manually paired (see where 'authToken' is passed in a s'null' above).
        console.log("Pairing succeeded, authToken is " + authToken);

    }
}

export class StandAloneExampleCloverConnectorListener extends Clover.remotepay.ICloverConnectorListener {
    protected cloverConnector: Clover.remotepay.ICloverConnector;
    private testStarted: boolean;

    constructor(cloverConnector: Clover.remotepay.ICloverConnector) {
        super();

        this.cloverConnector = cloverConnector;
        this.testStarted = false;
    }
    public onDeviceReady(merchantInfo: Clover.remotepay.MerchantInfo): void {
        console.log("In onDeviceReady, starting test", merchantInfo);
        if(!this.testStarted) {
            this.testStarted = true;
        }
        let saleRequest:Clover.remotepay.SaleRequest = new Clover.remotepay.SaleRequest();
        saleRequest.setExternalId(Clover.CloverID.getNewId());
        saleRequest.setAmount(10);
        console.log({message: "Sending sale", request: saleRequest});
        this.cloverConnector.sale(saleRequest);

    }
    public onSaleResponse(response:Clover.remotepay.SaleResponse): void {
        try{
            /*
             The sale is complete.  It might be canceled, or successful.  This can be determined by the
             values in the response.
             */
            console.log({message: "Sale response received", response: response});
            if (!response.getIsSale()) {
                console.error("Response is not a sale!");
            }
            console.log("Test Completed.  Cleaning up.");
            this.cloverConnector.showWelcomeScreen();
            this.cloverConnector.dispose();
        } catch (e) {
            console.error(e);
        }
    }

    // -----------------------------------------------------------------------------------------------
    // Implement callbacks that may happen depending on the card used, and settings
    protected onConfirmPaymentRequest(request: Clover.remotepay.ConfirmPaymentRequest): void {
        console.log({message: "Automatically accepting payment", request: request});
        this.cloverConnector.acceptPayment(request.getPayment());
    }
    protected onVerifySignatureRequest(request: Clover.remotepay.onVerifySignatureRequest): void {
        console.log({message: "Automatically accepting signature", request: request});
        this.cloverConnector.acceptSignature(request);
    }
    // Not strictly necessary, but useful for problems unless you watch the websocket traffic
    protected onDeviceError(deviceErrorEvent: Clover.remotepay.CloverDeviceErrorEvent): void {
        console.error("onDeviceError", deviceErrorEvent);
    }
}


// Create a factory that will give us 1.2 versions of the ICloverConnector
let configuration = {};
configuration[Clover.CloverConnectorFactoryBuilder.FACTORY_VERSION] = Clover.CloverConnectorFactoryBuilder.VERSION_12;
let connectorFactory: Clover.ICloverConnectorFactory = Clover.CloverConnectorFactoryBuilder.createICloverConnectorFactory(
    configuration
);

// Create the ICloverConnector
let cloverConnector: Clover.remotepay.ICloverConnector =
    connectorFactory.createICloverConnector( new StandAloneExampleWebsocketPairedCloverDeviceConfiguration());

// Add a listener to the connector
cloverConnector.addCloverConnectorListener(new StandAloneExampleCloverConnectorListener(cloverConnector));

// Clean up the connection on exit of the window.  This should be done with all connectors.
// This example uses jQuery to add a hook for the window `beforeunload` event that ensures that the connector is displosed of.
$(window).on('beforeunload ', function () {
    try {
        cloverConnector.dispose();
    } catch (e) {
        console.log(e);
    }
});

// This is where the processing will start.  This initializes the connection to the device, once successful it
// calls the StandAloneExampleCloverConnectorListener.onDeviceReady() callback.
cloverConnector.initializeConnection();




