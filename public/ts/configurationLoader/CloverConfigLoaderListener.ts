import * as Clover from 'remote-pay-cloud';

export interface CloverConfigLoaderListener {

    onCloverConfigSaveComplete(success:boolean, configurationKey:string, configuration:Clover.CloverDeviceConfiguration):void;

    onCloverConfigLoadComplete(success:boolean, configurationKey:string, configuration:Clover.CloverDeviceConfiguration):void;

    onConfigsList(configurations: Array<string>):void;
}

