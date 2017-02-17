var TestBase = require('./TestBase.js');

// Remove the following to turn off logging.
require("remote-pay-cloud").DebugConfig.loggingEnabled = true;

TestBase.ForceDisconnect = require("./ForceDisconnect.js");

// Each of the following decorates TestBase
require('./tests/*.js', {mode: 'expand'});

if ('undefined' !== typeof module) {
    module.exports = TestBase;
}
