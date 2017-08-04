import * as sdk from 'remote-pay-cloud-api';
import * as Clover from 'remote-pay-cloud';
import {TestBase2} from '../base/TestBase2';
import {ExampleCloverConnectorListener} from '../base/ExampleCloverConnectorListener';
import {CloverConfigLoader} from '../configurationLoader/CloverConfigLoader';

export class TestDisplayOrder extends TestBase2 {

    constructor(loader: CloverConfigLoader, progressInfoCallback: any) {
        super(loader, progressInfoCallback);
    }

    /**
     *
     */
    public getName(): string {
        return "Test displaying an order";
    }

    /**
     * Method to get the connector listener for this test
     *
     * @override
     * @param cloverConnector
     * @param progressInfoCallback
     */
    public getCloverConnectorListener(cloverConnector: Clover.CloverConnector, progressInfoCallback: any): sdk.remotepay.ICloverConnectorListener {
        let connectorListener: TestDisplayOrder.CloverConnectorListener = new TestDisplayOrder.CloverConnectorListener(cloverConnector, progressInfoCallback);
        return connectorListener;
    }
}

export namespace TestDisplayOrder {
    export class CloverConnectorListener extends ExampleCloverConnectorListener {

        private displayOrder:sdk.order.DisplayOrder = new sdk.order.DisplayOrder();

        /**
         * Used to identify the test in progress messages.
         *
         * @override
         * @returns {string}
         */
        protected getTestName(): string {
            return "Test displaying an order";
        }

        /**
         * @override
         */
        protected startTest(): void {
            super.startTest();
            /*
             The connector is ready
             */
            this.showOrder_1();
        }

        private showOrder_1 () {
            let lineItem:sdk.order.DisplayLineItem = new sdk.order.DisplayLineItem();
            lineItem.setId("TI1");
            lineItem.setName("Test Item 1");
            lineItem.setPrice("$12.34");
            let lineItems:Array<sdk.order.DisplayLineItem> = [];
            lineItems.push(lineItem);
            this.displayOrder.setLineItems(lineItems);

            this.displayOrder.setSubtotal("$12.34");
            this.displayOrder.setTotal("$12.34");

            this.displayMessage({message: "Showing a display order", displayOrder: this.displayOrder});
            this.cloverConnector.showDisplayOrder(this.displayOrder);
            setTimeout(function () {
                this.showOrder_2();
            }.bind(this), 5000);
        }
        private showOrder_2 () {

            // Add a line item
            let lineItem:sdk.order.DisplayLineItem = new sdk.order.DisplayLineItem();
            lineItem.setId("TI2");
            lineItem.setName("Test Item 2");
            lineItem.setPrice("$34.56");
            let lineItems:Array<sdk.order.DisplayLineItem> = this.displayOrder.getLineItems();
            lineItems.push(lineItem);
            this.displayOrder.setLineItems(lineItems);

            this.displayOrder.setSubtotal("$46.90");
            this.displayOrder.setTotal("$46.90");

            this.displayMessage({message: "Showing a display order", displayOrder: this.displayOrder});
            this.cloverConnector.showDisplayOrder(this.displayOrder);
            setTimeout(function () {
                this.showOrder_3();
            }.bind(this), 5000);
        }
        private showOrder_3 () {

            // Add some tax
            this.displayOrder.setSubtotal("$46.90");
            this.displayOrder.setTax(      "$3.28");
            this.displayOrder.setTotal(   "$50.18");

            this.displayMessage({message: "Showing a display order", displayOrder: this.displayOrder});
            this.cloverConnector.showDisplayOrder(this.displayOrder);
            setTimeout(function () {
                this.showOrder_4();
            }.bind(this), 5000);
        }
        private showOrder_4 () {
            // Add a discount
            let discounts:Array<sdk.order.DisplayDiscount> = [];
            let discount:sdk.order.DisplayDiscount = new sdk.order.DisplayDiscount();

            let lineItems:Array<sdk.order.DisplayLineItem> = this.displayOrder.getLineItems();
            let lineItem:sdk.order.DisplayLineItem = lineItems[0];

            discount.setId("TD1");
            discount.setLineItemId(lineItem.getId());
            discount.setName("Test Discount 1");
            discount.setAmount("$2.34");

            discounts.push(discount);
            lineItem.setDiscounts(discounts);
            lineItem.setDiscountAmount("$2.34");

            this.displayOrder.setSubtotal("$44.56");
            this.displayOrder.setTax(      "$3.28");
            this.displayOrder.setTotal(   "$50.18");

            this.displayMessage({message: "Showing a display order", displayOrder: this.displayOrder});
            this.cloverConnector.showDisplayOrder(this.displayOrder);
            setTimeout(function () {
                // Always call this when your test is done, or the device may fail to connect the
                // next time, because it is already connected.
                this.testComplete(true);
            }.bind(this), 5000);
        }

    }
}

