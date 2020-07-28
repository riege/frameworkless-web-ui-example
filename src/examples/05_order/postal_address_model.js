import { immerable } from "../../deps/immer.js";
import { AFTER_ACTION } from "../../base/store.js";
import { VALIDATION_RESULTS } from "../../base/validation.js";
import { isEmpty } from "../../base/util.js";

export class PostalAddressModel {
    constructor() {
        this[immerable] = true
        this.name = null
        this.street = null
        this.zipCode = null
        this.city = null
        this.country = null
    }

    [AFTER_ACTION]() {
        this[VALIDATION_RESULTS] = Object.getOwnPropertyNames(this)
            .map(property => validateNotEmpty(this, property))
            .filter(r => r !== undefined)
    }
}

function validateNotEmpty(object, prop) {
    const value = object[prop]
    if (isEmpty(value)) {
        return {key: prop, message: `${prop} should not be empty`}
    }
}
