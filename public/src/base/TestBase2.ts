import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';
import {CloverConfigLoaderListener} from '../configurationLoader/CloverConfigLoaderListener';

export abstract class TestBase2 implements CloverConfigLoaderListener {
	private logger: Clover.Logger = Clover.Logger.create();

	protected progressInfoCallback: any;

	private connector: Clover.CloverConnector;
	private connectorListener: Clover.CloverConnectorListener;

	private simpleCloverConfig: CloverConfigLoader;
	private configuration:Clover.CloverDeviceConfiguration;

	constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
		// This prevents developers from creating a new CloverDevice.
		// This class is abstract and needs to be extended with a custom
		// implementation.
		if (this.constructor === TestBase2) {
			throw new TypeError('Abstract class "TestBase2" cannot be instantiated directly.');
		}

		// Make sure the child class implements all abstract methods.
		if (this.getCloverConnectorListener === undefined) {
			throw new TypeError('Classes extending this abstract class must implement the "getCloverConnectorListener" method.');
		}

		this.progressInfoCallback = progressInfoCallback;

		// Create the Clover config manager.
		this.simpleCloverConfig = loader;
		this.simpleCloverConfig.addCloverConfigLoaderListener(this);
	}

	public onCloverConfigSaveComplete(success:boolean, configurationKey:string, configuration:Clover.CloverDeviceConfiguration):void {
		if(success) {
		}
	}

	public onCloverConfigLoadComplete(success:boolean, configurationKey:string, configuration:Clover.CloverDeviceConfiguration):void {
		if(success) {
			this.configuration = configuration;
		}
	}

	public onConfigsList(configurations: Array<string>):void {
	}

	/**
	 * Load the configuration and build the test
	 */
	public test(): void {
		this.logger.debug("Configuration: ", this.configuration);
		if(this.configuration) {
			this.readyTest(this.configuration);
		} else {
			this.logger.error("Configuration is not set.");
		}
	}

	/**
	 * 
	 * 
	 * @param error 
	 * @param configuration 
	 */
	private readyTest(configuration): void {
		this.displayMessage({message: configuration});
		this.connector = new Clover.CloverConnector(configuration);
		this.connectorListener = this.getCloverConnectorListener(this.connector, this.progressInfoCallback);
		this.connector.addCloverConnectorListener(this.connectorListener);
		this.connector.initializeConnection();
	}

	/**
	 * Displays the message in the console and passes
	 * it back in the progress callback
	 * 
	 * @param message - Message to display
	 */
	protected displayMessage(message: any): void {
		this.logger.info(message);
		if (this.progressInfoCallback) {
			this.progressInfoCallback(message);
		}
	}

	/**
	 * Abstract method to get the connector listener for this test
	 * 
	 * @param cloverConnector 
	 * @param progressInfoCallback 
	 */
	protected abstract getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener;

	public abstract getName(): string;
}

export default TestBase2;
