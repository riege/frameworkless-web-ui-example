import produce from '../deps/immer.js'

let state
let listeners = []

export function init(stateTree) {
    state = initialState(stateTree)
    listeners.forEach(f => f())
}

export function getState() {
    return state
}

export function dispatch(model, action, args) {
    state = reducer(state, model, action, args)
    listeners.forEach(f => f())
}

export function reducer(state, model, actionFunction, payload) {
    return produce(state, s => {
        const modelState = extractProperty(s, model)
        actionFunction(modelState, payload)
    })
}

export function subscribe(listener) {
    listeners.push(listener)
    return unsubscribe.bind(null, listener)
}

export function unsubscribe(toRemove) {
    listeners = listeners.filter(l => l != toRemove)
}

export function initialState(stateTree) {
    return produce(stateTree, state => {
        for (const key in state) {
            if (isModel(state[key])) {
                state[key] = state[key].initialState()
            } else if (isObject(state[key])) {
                state[key] = initialState(state[key])
            }
        }
    })
}

function isModel(object) {
    return object.initialState
}

function extractProperty(object, path) {
    if (!path) {
        return object
    }
    return path.split('.').reduce((o, prop) => o[prop], object)
}

function isObject(thing) {
    return typeof(thing) === 'object'
}
