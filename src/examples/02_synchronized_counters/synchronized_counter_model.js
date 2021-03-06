import { CounterModel } from '../01_counter/counter_model.js'
import { immerable } from '../../deps/immer.js'

export class SynchronizedCounterModel {
    constructor() {
        this[immerable] = true
        this._counterA = new CounterModel()
        this._counterB = new CounterModel()
        this._counterC = new CounterModel()
        this.synchronized = false
    }

    get counterA() {
        return this._counterA
    }

    get counterB() {
        if (this.synchronized) {
            return this._counterA
        }
        return this._counterB
    }

    get counterC() {
        if (this.synchronized) {
            return this._counterA
        }
        return this._counterC
    }

}
