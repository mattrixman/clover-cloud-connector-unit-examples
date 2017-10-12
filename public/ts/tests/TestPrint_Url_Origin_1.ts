import {TestPrint} from './TestPrint';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestPrint_Url_Origin_1 extends TestPrint {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        // additional params are: images [], urls [], text []

        super(loader, progressInfoCallback, null, [window.location.origin + "/images/print_test_0.bmp"], null);
    }
}