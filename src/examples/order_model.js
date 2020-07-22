import { immerable } from "../deps/immer.js";
import { VALIDATOR } from "../base/store.js";

function constant(name) {
    return `OrderModel#${name}`
}

export const STATE_DRAFT = constant('STATE_DRAFT')
export const STATE_SUBMITTING = constant('STATE_SUBMITTING')
export const STATE_ORDERED = constant('STATE_ORDERED')
export const STATE_FAILED = constant('STATE_FAILED')

export const PAYMENT_PAYPAL = constant('PAYMENT_PAYPAL')
export const PAYMENT_CASH_ON_DELIVERY = constant('PAYMENT_CASH_ON_DELIVERY')
export const PAYMENT_INVOICE = constant('PAYMENT_INVOICE')

function isEmpty(value) {
    if(typeof(value) === 'string') {
        return value.trim() === ''
    }
    return value === undefined || value === null
}

function validateNotEmpty(object, prop) {
    const value = object[prop]
    if (isEmpty(value)) {
        return {key: prop, message: `${prop} should not be empty`}
    }
}

export class OrderValidator {
    constructor() {
        this.shippingAddress = new PostalAddressValidator()
        this.invoiceAddress = new PostalAddressValidator()
    }
}

export class PostalAddressValidator {
    [VALIDATOR](order) {
        const result = Object.getOwnPropertyNames(order)
            .map(property => validateNotEmpty(order, property))
            .filter(r => r !== undefined)
        return result
    }
}

export class PostalAddressModel {
    constructor() {
        this[immerable] = true
        this.name = null
        this.street = null
        this.zipCode = null
        this.city = null
        this.country = null
    }

    [VALIDATOR]() {
        return Object.getOwnPropertyNames(this)
            .map(property => validateNotEmpty(this, property))
            .filter(r => r !== undefined)
    }
}

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
            this._invoiceAddress = this.shippingAddress
        }
        this._syncAddresses = value
    }

    [VALIDATOR]() {
        return [{
            key: 'shippingAddress.name',
            message: 'this is a test',
        }]
    }
}