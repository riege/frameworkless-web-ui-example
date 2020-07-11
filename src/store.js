const initialState = {
    counter: 0,
    actionLog: [],
    actionCount: 0,
    logLimit: 10,
}

function reducer(state, action) {
    state.actionLog = updateActionLog(state, action)
    state.actionCount++
    switch (action.type) {
        case 'COUNTER_INCREASE':
            return {...state, counter: state.counter + 1}
        case 'COUNTER_DECREASE':
            return {...state, counter: state.counter - 1}
        case 'COUNTER_SET':
            return {...state, counter: action.value}
        default:
            console.log(`Ignoring action of unknown type: ${action}`)
            return state
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
// console.log(`Initial state: ${store.getState()}`)
// console.log(`Initial state: ${initialState}`)
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
