import * as Clover from 'remote-pay-cloud';

export class ExampleWebsocketCloverDeviceConfiguration extends Clover.WebSocketCloverDeviceConfiguration {

    public constructor(
        endpoint: string,
        applicationId: string,
        posName: string,
        serialNumber: string,
        authToken: string,
        webSocketFactoryFunction:any,
        heartbeatInterval?: number,
        reconnectDelay?: number) {

        super(endpoint,
            applicationId,
            posName,
            serialNumber,
            authToken,
            webSocketFactoryFunction,
            heartbeatInterval,
            reconnectDelay);
    }

    public onPairingCode(pairingCode: string): void {
        console.log("Pairing code is " + pairingCode);
    }

    public onPairingSuccess(authToken: string): void {
        console.log("Pairing succeeded, authToken is " + authToken);
    }
}