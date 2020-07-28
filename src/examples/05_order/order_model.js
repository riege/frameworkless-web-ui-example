import { immerable } from "../../deps/immer.js";
import { AFTER_ACTION } from "../../base/store.js";
import { VALIDATION_RESULTS } from "../../base/validation.js";
import { submitOrderTask } from './order_service.js';
import { PostalAddressModel } from './postal_address_model.js';

function constant(name) {
    return `OrderModel#${name}`
}

export const STATE_DRAFT = constant('STATE_DRAFT')
export const STATE_SUBMITTING = constant('STATE_SUBMITTING')
export const STATE_ORDERED = constant('STATE_ORDERED')

export const PAYMENT_PAYPAL = constant('PAYMENT_PAYPAL')
export const PAYMENT_CASH_ON_DELIVERY = constant('PAYMENT_CASH_ON_DELIVERY')
export const PAYMENT_INVOICE = constant('PAYMENT_INVOICE')

export class OrderModel {
    constructor() {
        this[immerable] = true
        this.orderState = STATE_DRAFT
        this.shippingAddress = new PostalAddressModel()
        this._invoiceAddress = new PostalAddressModel()
        this.paymentMethod = PAYMENT_PAYPAL
        this._syncAddresses = true
    }

    get invoiceAddress() {
        if (this.syncAddresses) {
            return this.shippingAddress
        }
        return this._invoiceAddress
    }

    get syncAddresses() {
        return this._syncAddresses
    }

    set syncAddresses(value) {
        if (!value) {
            this._invoiceAddress = Object.assign(new PostalAddressModel(), this.shippingAddress)
        }
        this._syncAddresses = value
    }

    [AFTER_ACTION]() {
        this[VALIDATION_RESULTS] = null
        if (this.invoiceAddress[VALIDATION_RESULTS]) {
            this[VALIDATION_RESULTS] = this.invoiceAddress[VALIDATION_RESULTS]
                .map(result => Object.assign({}, result, {key: 'invoiceAddress.' + result.key}))
        }
        this._invoiceAddress[VALIDATION_RESULTS] = []
    }
}

export function submitOrder(orderModel) {
    orderModel.orderState = STATE_SUBMITTING
    orderModel.error = ""
    return {task: submitOrderTask, action: submissionComplete}
}

function submissionComplete(orderModel, response) {
    if (!response.error) {
        orderModel.orderState = STATE_ORDERED
    } else {
        orderModel.orderState = STATE_DRAFT
        orderModel.error = response.error
    }
}

export function editOrder(orderModel) {
    orderModel.orderState = STATE_DRAFT
    orderModel.error = ""
}
