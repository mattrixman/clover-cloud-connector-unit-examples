import * as sdk from 'remote-pay-cloud-api';
import {TestManualRefundWithOptions} from './TestManualRefundWithOptions';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestManualRefundWithOptions_1 extends TestManualRefundWithOptions {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        /*
        *   Settings can include (for ManualRefundRequests):
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
        let settings: sdk.remotepay.ManualRefundRequest = {
            autoAcceptPaymentConfirmations: true,
            autoAcceptSignature: true,
            disableReceiptSelection: true,
            signatureThreshold: 500
        };
        super(loader, progressInfoCallback, settings);
    }
}