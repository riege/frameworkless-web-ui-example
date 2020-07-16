import BaseModel from "../base/model.js"

export default class CounterModel extends BaseModel {
    constructor() {
        super()
        this.value = 0
    }

    static initialState() {
        return new this()
    }
}

export function increase(state) {
    state.value += 1
}

export function decrease(state) {
    state.value -= 1
}

export function set(state, value) {
    state.value = value
}