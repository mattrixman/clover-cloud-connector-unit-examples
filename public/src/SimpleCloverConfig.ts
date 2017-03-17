var $ = require('jquery');

export class SimpleCloverConfig {

    private log: any; // todo - type this

    constructor(log) {
        this.log = log;
    };

    public saveCloverConfig(configUrl: any, configuration: any, callback: any) {
        $.ajax({
            url: configUrl + '/' + configuration.friendlyId,
            type: "POST",
            method: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(configuration),
            cache: false,
            success: function (info) {
                callback(null, info);
            }.bind(this),
            error: function (xhr, status, err) {
                callback(err, {message: "saved config error", data: err});
            }.bind(this)
        });
    };

    public loadCloverConfig(configUrl: any, configuration: any, callback: any) {
        $.ajax({
            url: configUrl + '/' + configuration.friendlyId,
            method: "GET",
            dataType: 'json',
            cache: false,
            success: function (info) {
                callback(null, info);
            }.bind(this),
            error: function (xhr, status, err) {
                this.log.debug("load config error response: ", status, err);
                callback(err, {message: "load config error response", data: err});
            }.bind(this)
        });
    };

    public getConfigsList(configUrl: any, callback: any) {
        $.ajax({
            url: configUrl,
            method: "GET",
            dataType: 'json',
            cache: false,
            success: function (files) {
                callback(null, files);
            }.bind(this),
            error: function (xhr, status, err) {
                this.log.debug("load config error response: ", status, err);
                callback(err, {message: "load config error response", data: err});
            }.bind(this)
        });
    };
}