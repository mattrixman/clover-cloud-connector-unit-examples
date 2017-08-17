import {TestImageUrlPrint} from './TestImageUrlPrint';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestImageUrlPrint_1 extends TestImageUrlPrint {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback, "/images/print_test_0.bmp");
    }
}