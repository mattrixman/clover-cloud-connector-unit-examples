/*

This is an ugly file, but it is intended to be used only as a test tool.

 */

var $ = require('jquery');

import * as Clover from 'remote-pay-cloud';
import {ExampleCloverConnectorListener} from './base/ExampleCloverConnectorListener';
import {CloverConfigLoaderListener} from './configurationLoader/CloverConfigLoaderListener';
import {URLCloverConfigLoader} from './configurationLoader/URLCloverConfigLoader';
import {CloverConfigLoader} from './configurationLoader/CloverConfigLoader';
import {TestBase2} from './base/TestBase2';

import * as tests from './tests';

// Remove the following to turn off logging.
Clover.DebugConfig.loggingEnabled = true;

export class ExampleWebsocketPairedCloverDeviceConfiguration extends Clover.WebSocketPairedCloverDeviceConfiguration {
    /**
     * @param rawConfiguration - a raw json object for initialization.
     */
    public constructor(
        rawConfiguration: any ) {
        super(
            rawConfiguration.uri,
            rawConfiguration.appId,
            rawConfiguration.posName,
            rawConfiguration.serialNumber,
            rawConfiguration.authToken,
            Clover.BrowserWebSocketImpl.createInstance,
            new Clover.ImageUtil(),
            rawConfiguration.heartbeatInterval,
            rawConfiguration.reconnectDelay);
    }

    public onPairingCode(pairingCode: string): void {
        console.log("Pairing code is " + pairingCode);
        showPairingCode(pairingCode);
    }

    public onPairingSuccess(authToken: string): void {
        console.log("Pairing succeeded, authToken is " + authToken);
        clearPairingCode();
    }
}

export class ExampleWebsocketCloudCloverDeviceConfiguration extends Clover.WebSocketCloudCloverDeviceConfiguration {
    /**
     * @param rawConfiguration - a raw json object for initialization.
     */
    public constructor(
        rawConfiguration: any ) {
        super(
            rawConfiguration.appId,
            Clover.BrowserWebSocketImpl.createInstance,
            new Clover.ImageUtil(),
            rawConfiguration.cloverServer,
            rawConfiguration.accessToken,
            new Clover.HttpSupport(XMLHttpRequest),
            rawConfiguration.merchantId,
            rawConfiguration.deviceId,
            rawConfiguration.friendlyId,
            rawConfiguration.forceConnect,
            rawConfiguration.heartbeatInterval,
            rawConfiguration.reconnectDelay);
    }
}

// Example of configuration
let configuration: Clover.CloverDeviceConfiguration = new ExampleWebsocketPairedCloverDeviceConfiguration(
    {
        endpoint: "wss://Clover-C030UQ50550081.local.:12345/remote_pay",
        applicationId: "test.js.test",
        posName: "pos.name",
        serialNumber: "1122334455",
        authToken: null,
        heartbeatInterval: null,
        reconnectDelay: null
    }
);

// Configuration persistence.
// These examples use this path to persist.  This is part of the example 'server.js'
const CONFIG_BASE_PATH = '../configuration/';
let configLoader:CloverConfigLoader = new (class ExampleLoader extends URLCloverConfigLoader {

    constructor() {
        super(CONFIG_BASE_PATH);
    }

    /**
     * Returns a typed configuration for a raw persisted configuration.
     *
     * @param rawConfiguration - {type: <instance.constructor.name>, value: <untyped jsonobject CloverDeviceConfiguration>}
     * @returns {any}
     */
    public typeConfiguration(rawConfiguration: any): Clover.CloverDeviceConfiguration {
        if(rawConfiguration.type == "ExampleWebsocketPairedCloverDeviceConfiguration") {
            return new ExampleWebsocketPairedCloverDeviceConfiguration(rawConfiguration.value);
        } else if(rawConfiguration.type == "ExampleWebsocketCloudCloverDeviceConfiguration") {
            return new ExampleWebsocketCloudCloverDeviceConfiguration(rawConfiguration.value);
        }
        // try to figure it out
        else if(rawConfiguration.cloverServer && rawConfiguration.accessToken) {
            return new ExampleWebsocketCloudCloverDeviceConfiguration(rawConfiguration);
        } else if(rawConfiguration.uri && rawConfiguration.serialNumber) {
            return new ExampleWebsocketPairedCloverDeviceConfiguration(rawConfiguration);
        } else if(rawConfiguration.clientId && rawConfiguration.domain) {
            console.log("Configuration appears to be 1.1.0", rawConfiguration);
            return null;
        }
        console.log("Don't know how to type configuration", rawConfiguration);
        return null;
    }
});

// gui crap below
var pairingCodeDisplay = $('<div>  </div>');
$('body').append(pairingCodeDisplay);
$('body').append('<BR/>');
function showPairingCode(pairingCode) {
    pairingCodeDisplay.text("Enter code '"+pairingCode+"' on the Clover device.");
}
function clearPairingCode() {
    pairingCodeDisplay.text("  ");
}

var confignameeditor = $('<input type="text" id="confignameeditor" size="60">');
var configeditor = $('<textarea id="configeditor" style="margin: 0px; width: 882px; height: 193px;">');
// Make the configuration select
var configurationSelect = $('<select id="friendlyId" class="load-config-selector">');
// Example of the configuration loader listener.
configLoader.addCloverConfigLoaderListener( {
    onCloverConfigSaveComplete: (success:boolean, configurationKey:string, configuration:Clover.CloverDeviceConfiguration) => {
        console.log("onCloverConfigSaveComplete", success, configurationKey, configuration);
        configLoader.getConfigsList();
    },
    onCloverConfigLoadComplete: (success:boolean, configurationKey:string, configuration:Clover.CloverDeviceConfiguration) => {
        console.log("onCloverConfigLoadComplete", success, configurationKey, configuration);
        configeditor.val(JSON.stringify(configuration, null, '\t'));
        // $("#confignameeditor").val(configurationKey);
        confignameeditor.val(configurationKey);
    },
    onConfigsList: (configurations: Array<string>) => {
        console.log("onConfigsList", configurations);
        // Put the list of configurations in the select
        configurationSelect.empty();
        $(configurations).each(function() {
            configurationSelect.append($("<option>").attr('value',this).text(this));
        });
        if(configurations && configurations.length > 0) {
            if (typeof(Storage) !== "undefined") {
                let selected: string = localStorage.selected;
                if (selected) {
                    configLoader.loadCloverConfig(selected);
                    let dropdown: any = document.getElementById('friendlyId');
                    dropdown.value = selected;
                } else {
                    configLoader.loadCloverConfig(configurations[0]);
                    localStorage.selected = configurations[0];
                }
            } else {
                configLoader.loadCloverConfig(configurations[0]);
            }
        } else {
            // Hard coded default for examples
            var defaultConfig = new ExampleWebsocketPairedCloverDeviceConfiguration({
                "uri": "wss://Clover-C030UQ50550081.local.:12345/remote_pay",
                "heartbeatInterval": 1000,
                "reconnectDelay": 3000,
                "pingRetryCountBeforeReconnect": 4,
                "appId": "test.js.test",
                "posName": "pos.name",
                "serialNumber": "1122334455",
                "authToken": null
            });
            configLoader.saveCloverConfig("Clover-C030UQ50550081.local", defaultConfig);
        }
    }
});

// Handle the change of the select
configurationSelect.on('change', function() {
    configLoader.loadCloverConfig( this.value );
    if (typeof(Storage) !== "undefined") {
        localStorage.selected = this.value;
    }
});

// Add a button to load configurations
var btn = document.createElement("BUTTON");
var t = document.createTextNode("Load Configurations");
btn.appendChild(t);
btn.addEventListener("click", function(){
    configeditor.readOnly = false;
    configLoader.getConfigsList()
}, false);
document.body.appendChild(btn);
$('body').append('<BR/>');

// Put the configuration select below the buttons
confignameeditor.appendTo('body');
$('body').append('<BR/>');
configurationSelect.appendTo('body');
$(document).ready(function(){configLoader.getConfigsList();});

// Add a button to Edit/Save the configuration being edited
var btn = document.createElement("BUTTON");
var editSaveConfig = document.createTextNode("Save Configuration");
btn.appendChild(editSaveConfig);
btn.addEventListener("click", function(){
    var parsedConfig = JSON.parse(configeditor.val());
    configLoader.saveCloverConfig(confignameeditor.val(), parsedConfig);
    configLoader.getConfigsList();
}, false);
document.body.appendChild(btn);
$('body').append('<BR/>');
$('body').append('<BR/>');
$('body').append('<BR/>');

// A place to edit the configuration
$('body').append(configeditor);
$('body').append('<BR/>');

// Build the buttons
for (var property in tests) {
    if (tests.hasOwnProperty(property)) {
        let testMessage: TestBase2 = new tests[property](configLoader, function(message){console.log(message)});

        var btn = document.createElement("BUTTON");
        var t = document.createTextNode(testMessage.getName());
        btn.appendChild(t);
        btn.addEventListener("click", function(){testMessage.test()}, false);
        document.body.appendChild(btn);
        document.body.appendChild(document.createElement("BR") );
    }
}

console.log("Done loading typescript example.");