import {TestImagePrint} from './TestImagePrint';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestImagePrint_3 extends TestImagePrint {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback, "/images/test_receipt_3.png");
    }
}