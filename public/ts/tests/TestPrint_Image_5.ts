import {TestPrint} from './TestPrint';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestPrint_Image_5 extends TestPrint {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        // additional params are: images [], urls [], text []

        super(loader, progressInfoCallback, ["/images/test_receipt_5.jpg"], null, null);
    }
}