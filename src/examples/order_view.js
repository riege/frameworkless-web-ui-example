import { ReactiveElement } from '../base/elements.js';
import { html } from '../deps/lit-html.js';
import { setValue } from '../base/store.js';
import { PAYMENT_PAYPAL, PAYMENT_CASH_ON_DELIVERY, PAYMENT_INVOICE, submitOrder, STATE_DRAFT, STATE_ORDERED, editOrder } from './order_model.js';

class BoundTextfield extends ReactiveElement {

    constructor() {
        super()
        this.name = this.innerText
    }

    render() {
        return html`
            <label for="${this.name}">${this.name}:</label>
            <div class="validation validation-${this.valid ? 'ok' : 'error'}">
                <div class="validation-icon">${this.validationIcon}</div>
                <div class="validation-message">${this.validationMessage}</div>
            </div>
            <input type="text"
                   name="${this.name}"
                   .value="${this.state}"
                   @change="${this.eventHandler(setValue)}">
        `
    }
}
customElements.define('bound-textfield', BoundTextfield)

class BoundCheckbox extends ReactiveElement {

    render() {
        return html`
            <input type="checkbox"
                .checked="${this.state}"
                @change="${this.dispatchChecked(setValue)}"
            >${this.innerText}</input>
        `
    }
}
customElements.define('bound-checkbox', BoundCheckbox)

class BoundSelect extends ReactiveElement {

    constructor() {
        super()
        this.name = this.innerText
        this.options = []
    }

    renderOption([name, value]) {
        return html`<option value="${value}">${name}</option>`
    }

    render() {
        return html`
            <label for="${this.name}">${this.name}:</label>
            <select name="${this.name}"
                   .value="${this.state}"
                   @change="${this.eventHandler(setValue)}">
                   ${this.options.map(this.renderOption)}
            </select>
        `
    }
}
customElements.define('bound-select', BoundSelect)

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