import { ReactiveElement } from '../../base/elements.js';
import '../components.js'
import { html } from '../../deps/lit-html.js';
import { PAYMENT_PAYPAL, PAYMENT_CASH_ON_DELIVERY, PAYMENT_INVOICE, submitOrder, STATE_DRAFT, STATE_ORDERED, editOrder } from './order_model.js';

class PostalAddressView extends ReactiveElement {
    render() {
        return html`
            <bound-textfield model="${this.subModel('name')}">Full name</bound-textfield>
            <bound-textfield model="${this.subModel('street')}">Street</bound-textfield>
            <bound-textfield model="${this.subModel('zipCode')}">ZIP code</bound-textfield>
            <bound-textfield model="${this.subModel('city')}">City</bound-textfield>
            <bound-textfield model="${this.subModel('country')}">Country</bound-textfield>
        `
    }
}
customElements.define('postal-address-view', PostalAddressView)

class OrderView extends ReactiveElement {
    paymentMethods() {
        return [
            ["PayPal", PAYMENT_PAYPAL],
            ["Invoice", PAYMENT_INVOICE],
            ["Cash on delivery", PAYMENT_CASH_ON_DELIVERY],
        ]
    }

    render() {
        return html`
            <form class="order">
                <div>
                    <h3>Shipping Address</h3>
                    <postal-address-view
                        model="${this.subModel('shippingAddress')}">
                    </postal-address-view>
                </div>
                <div>
                    <h3>Invoice Address</h3>
                    <postal-address-view
                        model="${this.subModel('invoiceAddress')}">
                    </postal-address-view>
                    <bound-checkbox model="${this.subModel('syncAddresses')}">same as shipping</bound-checkbox>
                </div>
                <div>
                    <h3>Order</h3>
                    <bound-select
                        .options="${this.paymentMethods()}"
                        model="${this.subModel('paymentMethod')}">
                        Payment Method
                    </bound-select>
                    <br>
                    <button
                        .disabled="${!this.valid || this.state.orderState !== STATE_DRAFT}"
                        @click="${this.dispatch(submitOrder)}">
                        Submit Order
                    </button>
                    <button
                        style="visibility: ${this.state.orderState === STATE_ORDERED ? 'visible' : 'hidden'}"
                        @click="${this.dispatch(editOrder)}">
                        Edit Order
                    </button>
                    <br>
                    <span>${this.state.error}</span>
                    ${this.renderValidationMessages()}
                </div>
            </form>
        `
    }

    renderValidationMessages() {
        const messages = this.validationResults
            .map(result => html`<li>${result.message}</li>`)
        return html`<ul>${messages}</ul>`
    }
}
customElements.define('order-view', OrderView)
