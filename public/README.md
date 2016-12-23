# Adding a new Test

## Create The Test To Include

1.  Create a javascript file, and place it into the `public` directory, prefix the name with `Test`.  Example: 

        public/TestShowMessage.js

2.  Write the test.  All that is required is the addition of a function to TestBase.  Example: 
 
        var TestBase = require("./TestBase.js");

        TestBase.TestShowMessage = function(configUrl, progressinfoCallback) {
          console.log("TestShowMessage was called");
        }

3.  In `public/test-src.js` require the file. Example: 
        
        require("./TestShowMessage.js");

4.  In `public/index.html` add a button for the test, so that it can be manually invoked.  Example:

        <button onclick="TestBase.TestShowMessage('./configuration/', progressinfoCallback)">Test Showing a Message</button><br/>

## Make the test useful
This will allow you to run a very simple test.  If you want to test clover connector functionality (considering where this is, that is reasonable), then you will write an extension of the ICloverConnectorListener.  The easiest way to do this is to extend the ExampleCloverConnectorListener.  You can look at `public/TestShowMessage.js` for an example of a written test of the connector, or follow the process below.  For this, a simple message is displayed on the device for 5 seconds, then the connection to the device is shutdown (via the testComplete() call).

1.  `require()` the `ExampleCloverConnectorListener` so you can make your own extension to it.  Example:

        var ExampleCloverConnectorListener = require("./ExampleCloverConnectorListener.js");

2.  Create the extension to the class.  Accept the `cloverConnector` parameter and the `progressinfoCallback`.  Ensure that the prototype for the object and the constructor are properly set up.  Example:
        
        var ShowMessageExampleCloverConnectorListener = function (cloverConnector, progressinfoCallback) {
            ExampleCloverConnectorListener.call(this, cloverConnector, progressinfoCallback);
            this.cloverConnector = cloverConnector;
            this.progressinfoCallback = progressinfoCallback;
        };
        
        ShowMessageExampleCloverConnectorListener.prototype = Object.create(ExampleCloverConnectorListener.prototype);
        ShowMessageExampleCloverConnectorListener.prototype.constructor = ShowMessageExampleCloverConnectorListener;

3.  Add the override of the `onReady` function.  This is called when the connection to the device is ready for a test.  You will start your test flow from here.

        ShowMessageExampleCloverConnectorListener.prototype.onReady = function (merchantInfo) {
            ExampleCloverConnectorListener.prototype.onReady.call(this, merchantInfo);
            /*
             The connector is ready, you can use it to communicate with the device.
            */
            // This is used to display progress to the user
            this.displayMessage({message: "Sending request to read card data"});
            // Send a message to the device
            this.cloverConnector.showMessage("This message was sent to this device from the test framework");
            setTimeout(function () {
                // Always call this when your test is done, or the device may fail to connect the
                // next time, because it is already connected.
                this.testComplete();
            }.bind(this), 5000);
        };
        
4.  Add the function override that helps identify the test for display output.

        ShowMessageExampleCloverConnectorListener.prototype.getTestName = function () {
            return "Test Displaying a message on the device";
        };
    
5.  Create the new extension of the `TestBase`.  This tells the test about your ICloverConnectorListener.

        TestShowMessage = function (configUrl, friendlyName, progressinfoCallback) {
            TestBase.call(this, configUrl, friendlyName, progressinfoCallback);
        };
        
        TestShowMessage.prototype = Object.create(TestBase.prototype);
        TestShowMessage.prototype.constructor = TestShowMessage;
        
        TestShowMessage.prototype.getCloverConnectorListener = function (cloverConnector) {
            return new ShowMessageExampleCloverConnectorListener(cloverConnector, this.progressinfoCallback);
        };

6.  Change your invocation to run the new extension of the `TestBase`

        TestBase.TestShowMessage = function (configUrl, progressinfoCallback) {
            var testObj = new TestShowMessage(configUrl, "test", progressinfoCallback);
            testObj.test();
        };

There may be additional steps in the flow depending on the functionality being tested.  For more complex tests, look at `public/TestSale.js`, `public/TestAuth.js`, `public/TestPreAuth.js` and `public/TestPreAuthCapture.js`.    
 
 