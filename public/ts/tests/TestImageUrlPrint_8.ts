import {TestImageUrlPrint} from './TestImageUrlPrint';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestImageUrlPrint_8 extends TestImageUrlPrint {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback, "/images/test_receipt_8.jpg");
    }
}