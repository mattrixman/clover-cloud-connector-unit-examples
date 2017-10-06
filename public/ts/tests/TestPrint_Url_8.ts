import {TestPrint} from './TestPrint';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestPrint_Url_8 extends TestPrint {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        // additional params are: images [], urls [], text []

        super(loader, progressInfoCallback, null, ["https://raw.githubusercontent.com/clover/clover-cloud-connector-unit-examples/master/public/images/test_receipt_8.jpg"], null);
    }
}