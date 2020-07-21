import produce from '../deps/immer.js'

let state
let listeners = []

export function init(initialState) {
    state = produce(initialState, s => s)
    listeners.forEach(f => f())
}

export function getState() {
    return state
}

export function dispatch(model, action, args) {
    state = reducer(state, model, action, args)
    listeners.forEach(f => f())
}

function reducer(state, model, actionFunction, payload) {
    return produce(state, s => {
        if (actionFunction === setValue) {
            setProperty(s, model, payload)
        } else {
            const modelState = extractProperty(s, model)
            actionFunction(modelState, payload)
        }
    })
}

export function subscribe(listener) {
    listeners.push(listener)
    return unsubscribe.bind(null, listener)
}

function unsubscribe(toRemove) {
    listeners = listeners.filter(l => l != toRemove)
}

function extractProperty(object, path) {
    if (!path) {
        return object
    }
    return path.split('.').reduce((o, prop) => o[prop], object)
}

function setProperty(object, path, value) {
    const seperatorIndex = path.lastIndexOf('.')
    const parentPath = path.substring(0, seperatorIndex)
    const propertyToSet = path.substring(seperatorIndex+1, path.length)
    const parentObject = extractProperty(object, parentPath)
    parentObject[propertyToSet] = value
}

export function setValue() {
    throw Error(`
        Generic action for directly setting a value.
        Should never be called.
    `)
}
