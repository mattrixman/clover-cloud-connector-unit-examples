import * as Clover from 'remote-pay-cloud';
import {ExampleCloverConnectorListener} from './base/ExampleCloverConnectorListener';
import {ExampleWebsocketCloverDeviceConfiguration} from './base/ExampleWebsocketCloverDeviceConfiguration';

//function requireAll(r) {
//    r.keys().forEach(r);

// Remove the following to turn off logging.
Clover.DebugConfig.loggingEnabled = true;

export class BrowserWebSocketImpl extends Clover.CloverWebSocketInterface {

    constructor(endpoint: string) {
        super(endpoint);
    }

    /**
     *
     * @override
     * @param endpoint - the url that will connected to
     * @returns {WebSocket} - the specific implementation of a websocket
     */
    public createWebSocket(endpoint: string): any {
        return new WebSocket(endpoint);
    }

    /**
     * Browser implementations do not do pong frames
     */
    public sendPong(): Clover.CloverWebSocketInterface {
        return this;
    }

    /**
     * Browser implementations do not do ping frames
     */
    public sendPing(): Clover.CloverWebSocketInterface {
        return this;
    }

    /**
     * Create an instance of this class
     *
     * @param endpoint
     * @returns {BrowserWebSocketImpl}
     */
    public static createInstance(endpoint: string): BrowserWebSocketImpl {
        return new BrowserWebSocketImpl(endpoint);
    }
}


let configuration: Clover.CloverDeviceConfiguration = new ExampleWebsocketCloverDeviceConfiguration(
    //endpoint: string,
    "wss://Clover-C030UQ50550081.local.:12345/remote_pay",
    //applicationId: string
    "test.js.test",
    //posName: string,
    "pos.name",
    //serialNumber: string,
    "1122334455",
    // authToken: string,
    null,
    // webSocketImplClass:any,
    BrowserWebSocketImpl.createInstance
    // heartbeatInterval?: number, reconnectDelay?: number
);
console.log(configuration);

export class TestCloverConnectorListener extends ExampleCloverConnectorListener {
    /**
     * Used to identify the test in progress messages.
     *
     * @override
     * @returns {string}
     */
    protected getTestName(): string {
        return "Test Displaying a message on the device";
    }

    /**
     * @override
     */
    protected startTest(): void {
        super.startTest();
        /*
         The connector is ready, you can use it to communicate with the device.
         */
        this.displayMessage({message: "Sending message to display"});
        this.cloverConnector.showMessage("This message was sent to this device from the test framework");
        setTimeout(function () {
            // Always call this when your test is done, or the device may fail to connect the
            // next time, because it is already connected.
            this.cloverConnector.showWelcomeScreen();
            this.testComplete(true);
        }.bind(this), 5000);
    }
}

var connector:Clover.CloverConnector = new Clover.CloverConnector(configuration);
var connectorListener:TestCloverConnectorListener = new TestCloverConnectorListener(connector, function(message){console.log(message)});
connector.addCloverConnectorListener(connectorListener);
connector.initializeConnection();

//TestBase.ForceDisconnect = require("./ForceDisconnect.js");
//
//// Each of the following decorates TestBase
//requireAll(require.context('./tests', true, /\.js$/));
//
//if ('undefined' !== typeof module) {
//    module.exports = TestBase;
//}
