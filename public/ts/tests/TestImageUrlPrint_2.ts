import {TestImageUrlPrint} from './TestImageUrlPrint';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestImageUrlPrint_2 extends TestImageUrlPrint {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback, "/images/print_test_0.gif");
    }
}