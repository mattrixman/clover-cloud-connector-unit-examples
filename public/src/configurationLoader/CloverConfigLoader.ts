import * as Clover from 'remote-pay-cloud';
import {CloverConfigLoaderListener} from './CloverConfigLoaderListener';


export abstract class CloverConfigLoader {

    protected logger: Clover.Logger;
    private listeners: Array<CloverConfigLoaderListener>;

    constructor(logger: Clover.Logger) {
        if(!logger) {
            logger = Clover.Logger.create();
        }
        this.logger = logger;
        this.listeners = new Array<CloverConfigLoaderListener>();
    };

    public clear(): void {
        this.listeners.splice(0, this.listeners.length);
    }

    public addCloverConfigLoaderListener(listener: CloverConfigLoaderListener) : void {
        this.listeners.push(listener);
    }

    public removeCloverConfigLoaderListener(listener: CloverConfigLoaderListener) : void {
        var index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    public notifyOnConfigsList(configurations: Array<string>): void {
        this.logger.debug('Sending ConfigsList notification to listeners');
        this.listeners.forEach((listener: CloverConfigLoaderListener) => {
            try {
                listener.onConfigsList(configurations);
            }
            catch(e) {
                this.logger.error(e);
            }
        });
    }

    public notifyOnCloverConfigSaveComplete(success:boolean, configurationKey:string, configuration:Clover.CloverDeviceConfiguration): void {
        this.logger.debug('Sending CloverConfigSaveComplete notification to listeners');
        this.listeners.forEach((listener: CloverConfigLoaderListener) => {
            try {
                listener.onCloverConfigSaveComplete(success, configurationKey, configuration);
            }
            catch(e) {
                this.logger.error(e);
            }
        });
    }

    public notifyOnCloverConfigLoadComplete(success:boolean, configurationKey:string, configuration:Clover.CloverDeviceConfiguration): void {
        this.logger.debug('Sending CloverConfigLoadComplete notification to listeners');
        this.listeners.forEach((listener: CloverConfigLoaderListener) => {
            try {
                listener.onCloverConfigLoadComplete(success, configurationKey, configuration);
            }
            catch(e) {
                this.logger.error(e);
            }
        });
    }

    public abstract saveCloverConfig(configurationKey:string, configuration:Clover.CloverDeviceConfiguration):void;

    public abstract loadCloverConfig(configurationKey:string):void;

    public abstract getConfigsList():void;
}

