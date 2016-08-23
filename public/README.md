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
        
        var TestShowMessage = require("./TestShowMessage.js");

4.  In `public/index.html` add a button for the test, so that it can be manually invoked.  Example:

        <button onclick="TestBase.TestShowMessage('./configuration/', progressinfoCallback)">Test Showing a Message</button><br/>

## Make the test useful
This will allow you to run a very simple test.  If you want to test clover connector functionality (considering where this is, that is reasonable), then you will write an extension of the ICloverConnectorListener.  The easiest way to do this is to extend the ExampleCloverConnectorListener.  You can look at `public/TestShowMessage.js` for an example of a written test of the connector, or follow the process below.  For this, a simple message is displayed on the device for 5 seconds, then the connection to the device is shutdown (via the testComplete() call).

1.  `require()` the `ExampleCloverConnectorListener` so you can make your own extension to it.  Also `require()` the `prototype` library that provides the framework for making extensions to javascript classes. Example:

        require("prototype");
        var ExampleCloverConnectorListener = require("./ExampleCloverConnectorListener.js");

2.  Create the extension to the class.  Example:
        
        var ShowMessageExampleCloverConnectorListener = Class.create( ExampleCloverConnectorListener, {
        });

3.  Add the override of the `onReady` function.  This is called when the connection to the device is ready for a test.  You will start your test flow from here.

        onReady: function ($super, merchantInfo) {
            $super(merchantInfo);
            /*
             The connector is ready, create a sale request and send it to the device.
             */
            this.displayMessage({message: "Sending request to read card data"});
            this.cloverConnector.showMessage("This message was sent to this device from the test framework");
            setTimeout(function(){
                // Always call this when your test is done, or the device may fail to connect the
                // next time, because it is already connected.
                this.testComplete();
            }.bind(this), 5000);
        }
        
4.  Add the function override that helps identify the test for display output.

        getTestName: function() {
            return "Test Displaying a message on the device";
        }
    
5.  Create the new extension of the `TestBase`.  This just tells the test about your ICloverConnectorListener.

        TestShowMessage = Class.create( TestBase, {
            getCloverConnectorListener: function(cloverConnector) {
                return new ShowMessageExampleCloverConnectorListener(cloverConnector, progressinfoCallback);
            }
        });

6.  Change your invocation to run the new extension of the `TestBase`

        TestBase.TestShowMessage = function(configUrl, progressinfoCallback) {
            var testObj = new TestShowMessage(configUrl, "test", progressinfoCallback);
            testObj.test();
        }


There may be additional steps in the flow depending on the functionality being tested.  For more complex tests, look at `public/TestSale.js`, `public/TestAuth.js`, `public/TestPreAuth.js` and `public/TestPreAuthCapture.js`.    
 
 