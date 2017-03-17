import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {SimpleCloverConfig} from '../SimpleCloverConfig';

export abstract class TestBase2 {
	private logger: Clover.Logger = Clover.Logger.create();

	protected configUrl: string;
	protected friendlyName: string;
	protected progressInfoCallback: any;

	private connector: Clover.CloverConnector;
	private connectorListener: Clover.CloverConnectorListener;

	private simpleCloverConfig: SimpleCloverConfig;

	constructor(configUrl: string, friendlyName: string, progressInfoCallback: any) {
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

		// Store the config and callback.
		this.configUrl = configUrl;
		this.friendlyName = friendlyName;
		this.progressInfoCallback = progressInfoCallback;

		// Create the Clover config manager.
		this.simpleCloverConfig = new SimpleCloverConfig(this.logger);
	}

	/**
	 * Load the configuration and build the test
	 */
	public test(): void {
		this.logger.debug({message: "About to load configuration..."});
		this.simpleCloverConfig.loadCloverConfig(this.configUrl, {friendlyId: this.friendlyName}, this.readyTest.bind(this));
	}

	/**
	 * 
	 * 
	 * @param error 
	 * @param configuration 
	 */
	private readyTest(error, configuration): void {
		if (error) {
			this.displayMessage({error: error});
		}
		else {
			this.displayMessage({message: configuration});
			configuration = this.decorateConfiguration(configuration);;
			this.connector = new Clover.CloverConnector(configuration);
			this.connectorListener = this.getCloverConnectorListener(this.connector, this.progressInfoCallback);
			this.connector.addCloverConnectorListener(this.connectorListener);
			this.connector.initializeConnection();
		}
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
	 * Adds any required config values
	 * 
	 * @param configuration - Configuration to modify
	 * @returns modified configuration
	 */
	private decorateConfiguration(configuration): string {
		configuration.friendlyId = this.friendlyName;
		return configuration;
	}

	/**
	 * Abstract method to get the connector listener for this test
	 * 
	 * @param cloverConnector 
	 * @param progressInfoCallback 
	 */
	protected getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        throw new Error('Method not implemented');
	}
}

export default TestBase2;
