import counterModel from './counter_model.js'

export default class SynchronizedCounterModel {
    constructor() {
        this._counterA = counterModel.initialState()
        this._counterB = counterModel.initialState()
        this._counterC = counterModel.initialState()
        this.counterCounter = counterModel.initialState()
        this._counters = []
        this.synchronized = false
        this.synchronizedList = false
    }

    get counters() {
        for (let i = this._counters.length; i < this.counterCounter.value; i++) {
            this._counters[i] = counterModel.initialState()
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