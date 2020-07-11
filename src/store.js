import produce from './immer.js'

const initialState = Object.freeze({
    counter: 0,
    actionLog: Object.freeze([]),
    actionCount: 0,
    logLimit: 10,
})

function reducer(state, action) {
    return immer.produce(state, s => process(s, action))
}

function process(state, action) {
    state.actionLog = updateActionLog(state, action)
    state.actionCount++
    switch (action.type) {
        case 'COUNTER_INCREASE':
            state.counter++
            break
        case 'COUNTER_DECREASE':
            state.counter--
            break
        case 'COUNTER_SET':
            state.counter = action.value
            break
        default:
            console.log(`Ignoring action of unknown type: ${JSON.stringify(action)}`)
    }
}

function updateActionLog(state, action) {
    return [JSON.stringify(action), ...state.actionLog.slice(0, state.logLimit-1)]
}

const store = {
    state: initialState,
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

console.log('Store initialized to ', store.getState())
store.subscribe(_ => console.log('Store changed to ', store.getState()))

export default {
    getState() {
        return store.getState()
    },
    incrementCounter() {
        return store.dispatch({type: 'COUNTER_INCREASE'})
    },
    decrementCounter() {
        return store.dispatch({type: 'COUNTER_DECREASE'})
    },
    setCounter(event) {
        const value = parseInt(event.target.value)
        return store.dispatch({type: 'COUNTER_SET', value})
    },
    subscribe(listener) {
        store.subscribe(listener)
    },
}
