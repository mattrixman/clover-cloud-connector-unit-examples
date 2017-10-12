import * as sdk from 'remote-pay-cloud-api';
import {TestPreAuthWithOptions} from './TestPreAuthWithOptions';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestPreAuthWithOptions_1 extends TestPreAuthWithOptions {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        /*
        *   Settings can include (for PreAuthRequests):
        *       autoAcceptPaymentConfirmations			boolean
        *       autoAcceptSignature						boolean
        *       cardEntryMethods						number
        *       cardNotPresent							boolean
        *       disableDuplicateChecking				boolean
        *       disablePrinting							boolean
        *       disableReceiptSelection					boolean
        *       disableRestartTransactionOnFail			boolean
        *       signatureEntryLocation					sdk.payments.DataEntryLocation
        *       signatureThreshold						number
        */
        let settings: sdk.remotepay.PreAuthRequest = (<any>Object).assign({}, {
            autoAcceptPaymentConfirmations: true,
            autoAcceptSignature: true,
            disableReceiptSelection: true,
            signatureThreshold: 500
        });
        super(loader, progressInfoCallback, settings);
    }
}