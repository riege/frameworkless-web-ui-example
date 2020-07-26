import CounterModel from '../01_counter/counter_model.js'
import {immerable} from '../../deps/immer.js'

class CounterCounterModel {
    constructor() {
        this[immerable] = true
        this._counters = []
        this._value = 0
    }

    get value() {
        return this._value
    }

    set value(newValue) {
        this._value = newValue
        this._counters = this._counters.slice(0, this._value)
        for (let i = this._counters.length; i < this.value; i++) {
            this._counters[i] = new CounterModel()
        }
    }
}

export default class SynchronizedCounterListModel {
    constructor() {
        this[immerable] = true
        this.counterCounter = new CounterCounterModel()
        this.synchronized = false
    }

    get counters() {
        if (this.synchronized) {
            const firstCounter = this.counterCounter._counters[0]
            return this.counterCounter._counters.map(_ => firstCounter)
        }
        return this.counterCounter._counters
    }

}

export function setSync(model, value) {
    model.synchronized = value
}