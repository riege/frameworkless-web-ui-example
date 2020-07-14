import produce from '../deps/immer.js'
import counterModel from '../examples/counter_model.js'
import actionlogModel from '../examples/actionlog_model.js'
import gameModel from '../examples/game/game_model.js'

function initialState() {
    return Object.freeze({
        actionLog: Object.freeze(actionlogModel.initialState()),
        counter: Object.freeze(counterModel.initialState()),
        game: Object.freeze(gameModel.initialState())
    })
}

function reducer(state, action) {
    return produce(state, s => process(s, action))
}

function process(state, action) {
    actionlogModel.process(state.actionLog, action)
    counterModel.process(state.counter, action)
    gameModel.process(state.game, action)
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
    dispatch(type, payload) {
        store.dispatch({ type, payload })
    },
    subscribe(listener) {
        return store.subscribe(listener)
    },
}