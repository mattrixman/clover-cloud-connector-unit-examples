import {TestImagePrint} from './TestImagePrint';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestImagePrint_5 extends TestImagePrint {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback, "/images/test_receipt_5.png");
    }
}