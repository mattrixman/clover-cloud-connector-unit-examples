var Clover = require("remote-pay-cloud");
var TestBase = require('./TestBase.js');

function requireAll(r) {
    r.keys().forEach(r);
}

// Remove the following to turn off logging.
Clover.DebugConfig.loggingEnabled = true;

// TestBase.ForceDisconnect = require("./ForceDisconnect.js");

// Each of the following decorates TestBase
requireAll(require.context('./tests', true, /\.js$/));

if ('undefined' !== typeof module) {
    module.exports = TestBase;
}
