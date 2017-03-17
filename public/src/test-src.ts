import * as Clover from 'remote-pay-cloud';
//import {WebSocketInterface} from 'remote-pay-cloud';
//import {WebSocketState} from 'remote-pay-cloud';
//import {WebSocketCloverDeviceConfiguration} from 'remote-pay-cloud';


//function requireAll(r) {
//    r.keys().forEach(r);
//}

// Remove the following to turn off logging.
Clover.DebugConfig.loggingEnabled = true;
//console.log(TestShowMessage);
//var base = new TestShowMessage('./configuration', 'zebmini', function(logger) {
//    console.log('This is a test!');
//});
//base.test();

class BrowserWebSocketImpl extends WebSocket implements Clover.WebSocketInterface {
    constructor(endpoint: string) {
        super(endpoint);
    }
    getUrl(): String {
        return this.url;
    }
    getReadyState(): Clover.WebSocketState {
        return Clover.WebSocketState[this.readyState];
    }
    getBufferedAmount(): number {
        return this.bufferedAmount;
    }
    setOnOpen(onFunction):void {
        this.onopen = onFunction;
    }
    setOnMessage(onFunction):void {
        this.onopen = onFunction;
    }
    setOnError(onFunction):void {
        this.onopen = onFunction;
    }
    setOnClose(onFunction):void {
        this.onopen = onFunction;
    }
    getProtocol(): string {
        return this.protocol;
    }
}


var config: Clover.WebSocketCloverDeviceConfiguration = new Clover.WebSocketCloverDeviceConfiguration(
    //endpoint: string,
    "wss://10.249.252.157:12345/remote_pay",
    //applicationId: string
    "test.js.test",
    //posName: string,
    "pos.name",
    //serialNumber: string,
    1122334455,
    // authToken: string,
    null,
    // webSocketImplClass:any,
    BrowserWebSocketImpl
    // heartbeatInterval?: number, reconnectDelay?: number
);
console.log(config);


//TestBase.ForceDisconnect = require("./ForceDisconnect.js");
//
//// Each of the following decorates TestBase
//requireAll(require.context('./tests', true, /\.js$/));
//
//if ('undefined' !== typeof module) {
//    module.exports = TestBase;
//}
