import {immerable} from '../deps/immer.js'

export default class CounterModel {
    constructor() {
        this[immerable] = true
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