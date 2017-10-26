import * as sdk from 'remote-pay-cloud-api';
import {TestSaleWithOptions} from './TestSaleWithOptions';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestSaleWithOptions_1 extends TestSaleWithOptions {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        /*
        *   Settings can include (for SaleRequests):
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
        *       disableTipOnScreen						boolean
        *       forceOfflinePayments					boolean
        *       tipMode									sdk.payments.TipMode
        */

        let settings: sdk.remotepay.SaleRequest = (<any>Object).assign({}, {
            autoAcceptPaymentConfirmations: true,
            autoAcceptSignature: true,
            disableReceiptSelection: true,
            disableCashback: true,
            disableTipOnScreen: true,
            signatureThreshold: 500
        });
        super(loader, progressInfoCallback, settings);
    }
}