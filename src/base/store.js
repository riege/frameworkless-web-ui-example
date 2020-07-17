import produce from '../deps/immer.js'
import gameModel from '../examples/game/game_model.js'

function initialState() {
    return Object.freeze({
        game: Object.freeze(gameModel.initialState())
    })
}

function reducer(state, action) {
    return produce(state, s => process(s, action))
}

function process(state, action) {
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