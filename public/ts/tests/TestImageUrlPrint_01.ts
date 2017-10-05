import {TestImageUrlPrint} from './TestImageUrlPrint';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestImageUrlPrint_01 extends TestImageUrlPrint {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback, "/images/test_receipt_1.jpg");
    }
}