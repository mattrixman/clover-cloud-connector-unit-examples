var Clover = require("remote-pay-cloud");
var TestBase = require('./TestBase.js');
var TestBase2 = require('./dist/TestBase2').TestBase2;

function requireAll(r) {
    r.keys().forEach(r);
}

// Remove the following to turn off logging.
Clover.DebugConfig.loggingEnabled = true;
console.log(TestBase2);
var base = new TestBase2('./configuration', 'zebmini', function(logger) {
    logger.info('This is a test!');
});
base.test();

TestBase.ForceDisconnect = require("./ForceDisconnect.js");

// Each of the following decorates TestBase
requireAll(require.context('./tests', true, /\.js$/));

if ('undefined' !== typeof module) {
    module.exports = TestBase;
}
