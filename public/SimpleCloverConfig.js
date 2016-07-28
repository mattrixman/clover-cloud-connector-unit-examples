var $ = require('jquery');
require("prototype");

SimpleCloverConfig = Class.create( {
    initialize: function (log) {
        this.log = log;
    },
    saveCloverConfig: function (configUrl, configuration, callback) {
        $.ajax({
            url: configUrl + configuration.friendlyId,
            type: "POST",
            method: "POST",
            contentType:"application/json; charset=utf-8",
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
    },
    loadCloverConfig: function(configUrl, configuration, callback) {
        $.ajax({
            url: configUrl + configuration.friendlyId,
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
    }
});

if ('undefined' !== typeof module) {
    module.exports = SimpleCloverConfig;
}

