import counterModel from './counter_model.js'
import CounterModel from './counter_model.js'

export default class SynchronizedCounterModel {
    constructor() {
        this._counterA = new CounterModel()
        this._counterB = new CounterModel()
        this._counterC = new CounterModel()
        this.counterCounter = new CounterModel()
        this._counters = []
        this.synchronized = false
        this.synchronizedList = false
    }

    get counters() {
        for (let i = this._counters.length; i < this.counterCounter.value; i++) {
            this._counters[i] = new CounterModel()
        }
        this._counters.splice(this.counterCounter.value, this._counters.length)
        if (this.synchronizedList) {
            const firstCounter = this._counters[0]
            return this._counters.map(_ => firstCounter)
        }
        return this._counters
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

    static initialState() {
        return new SynchronizedCounterModel()
    }

}

export function setSync(model, value) {
    model.synchronized = value
}

export function addCounter(model) {
    model._counters.push(counterModel.initialState())
}

export function removeCounter(model, i) {
    model._counters.splice(i, i+1)
}

export function setListSync(model, value) {
    model.synchronizedList = value
}