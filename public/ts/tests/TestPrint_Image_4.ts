import {TestPrint} from './TestPrint';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestPrint_Image_4 extends TestPrint {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        // additional params are: images [], urls [], text []

        super(loader, progressInfoCallback, ["/images/test_receipt_4.jpg"], null, null);
    }
}