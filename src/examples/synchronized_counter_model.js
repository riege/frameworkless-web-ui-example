import counterModel from './counter_model.js'

export default class SynchronizedCounterModel {
    constructor() {
        this._counterA = counterModel.initialState()
        this._counterB = counterModel.initialState()
        this._counterC = counterModel.initialState()
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

    static initialState() {
        return new SynchronizedCounterModel()
    }

}

export function enableSync(model) {
    model.synchronized = true
}

export function disableSync(model) {
    model.synchronized = false
}

export function setSync(model, value) {
    model.synchronized = value
}