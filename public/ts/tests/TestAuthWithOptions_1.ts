import * as sdk from 'remote-pay-cloud-api';
import {TestAuthWithOptions} from './TestAuthWithOptions';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestAuthWithOptions_1 extends TestAuthWithOptions {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        /*
        *   Settings can include (for AuthRequests):
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
        *       allowOfflinePayments					boolean
        *       approveOfflinePaymentWithoutPrompt		boolean
        *       disableCashback							boolean
        *       forceOfflinePayments					boolean
        */
        let settings: sdk.remotepay.AuthRequest = (<any>Object).assign({}, {
            autoAcceptPaymentConfirmations: true,
            autoAcceptSignature: true,
            disableReceiptSelection: true,
            disableCashback: true,
            signatureThreshold: 500
        });
        super(loader, progressInfoCallback, settings);
    }
}