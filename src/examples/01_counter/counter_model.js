import { immerable } from '../../deps/immer.js'

export class CounterModel {
    constructor() {
        this[immerable] = true
        this.value = 0
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