import {TestPrint} from './TestPrint';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestPrint_All_1 extends TestPrint {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        // additional params are: images [], urls [], text []

        super(loader, progressInfoCallback, ["/images/test_receipt_1.jpg"], ["https://raw.githubusercontent.com/clover/clover-cloud-connector-unit-examples/master/public/images/print_test_0.bmp"], ["Printing one of each thing..."]);
    }
}