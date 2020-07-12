import produce from './immer.js'
import counterModel from './examples/counterModel.js'
import actionlogModel from './examples/actionlogModel.js'

function initialState() {
    return Object.freeze({
        actionLog: Object.freeze(actionlogModel.initialState()),
        counter: Object.freeze(counterModel.initialState()),
    })
}

function reducer(state, action) {
    return immer.produce(state, s => process(s, action))
}

function process(state, action) {
    actionlogModel.process(state.actionLog, action)
    counterModel.process(state.counter, action)
}

const store = {
    state: initialState(),
    listeners: [],
    getState() {
        return this.state
    },
    dispatch(action) {
        this.state = reducer(this.state, action)
        this.listeners.forEach(f => f())
    },
    subscribe(listener) {
        this.listeners.push(listener)
        return this.unsubscribe.bind(this, listener)
    },
    unsubscribe(toRemove) {
        this.listeners = this.listeners.filter(l => l != toRemove)
    },
}

export default {
    getState() {
        return store.getState()
    },
    incrementCounter() {
        return store.dispatch({ type: 'COUNTER_INCREASE' })
    },
    decrementCounter() {
        return store.dispatch({ type: 'COUNTER_DECREASE' })
    },
    setCounter(event) {
        const value = parseInt(event.target.value)
        return store.dispatch({ type: 'COUNTER_SET', value })
    },
    subscribe(listener) {
        store.subscribe(listener)
    },
}