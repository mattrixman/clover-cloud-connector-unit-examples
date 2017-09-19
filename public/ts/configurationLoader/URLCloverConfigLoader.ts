var $ = require('jquery');
import * as Clover from 'remote-pay-cloud';
import {CloverConfigLoader} from './CloverConfigLoader';

export abstract class URLCloverConfigLoader extends CloverConfigLoader {

    private configUrl: any;

    constructor(configUrl: any, log?: Clover.Logger) {
        super(log);
        this.configUrl = configUrl;
    };

    public saveCloverConfig(configurationKey:string, configuration:Clover.CloverDeviceConfiguration):void {
        var typedConfiguration = this.typeConfiguration(configuration);
        if(typedConfiguration) {
            // configUrl: any, configuration: any, callback: any) {
            $.ajax({
                url: this.configUrl + '/' + configurationKey,
                type: "POST",
                method: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify({type: typedConfiguration.constructor.name, value: typedConfiguration}),
                cache: false,
                success: function (info) {
                    this.notifyOnCloverConfigSaveComplete(true, configurationKey, typedConfiguration);
                }.bind(this),
                error: function (xhr, status, err) {
                    this.notifyOnCloverConfigSaveComplete(false, configurationKey, typedConfiguration);
                }.bind(this)
            });
            if (typeof(Storage) !== "undefined") {
                localStorage.selected = configurationKey;
            }
        } else {
            this.notifyOnCloverConfigSaveComplete(false, configurationKey, configuration);
        }
    };

    public loadCloverConfig(configurationKey:string): void {
        // configUrl: any, configuration: any, callback: any) {
        $.ajax({
            url: this.configUrl + '/' + configurationKey,
            method: "GET",
            dataType: 'json',
            cache: false,
            success: function (info) {
                let configuration:Clover.CloverDeviceConfiguration = this.typeConfiguration(info);
                if(configuration) {
                    this.notifyOnCloverConfigLoadComplete(true, configurationKey, configuration);
                }
            }.bind(this),
            error: function (xhr, status, err) {
                this.logger.debug("load config error response: ", status, err);
                // callback(err, {message: "load config error response", data: err});
                this.notifyOnCloverConfigLoadComplete(false, configurationKey, null);
            }.bind(this)
        });
    };

    public getConfigsList(): void {
        $.ajax({
            url: this.configUrl,
            method: "GET",
            dataType: 'json',
            cache: false,
            success: function (files) {
                this.logger.debug("getConfigsList response: ", files);
                this.notifyOnConfigsList(files.files);
            }.bind(this),
            error: function (xhr, status, err) {
                this.logger.debug("load config error response: ", status, err);
                this.notifyOnConfigsList([]);
            }.bind(this)
        });
    };

    public abstract typeConfiguration(rawConfiguration: any): Clover.CloverDeviceConfiguration;

}