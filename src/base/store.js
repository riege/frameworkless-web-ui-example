import produce from '../deps/immer.js'
import { createStore } from '../deps/redux.js'

const ACTION_INIT = 'ACTION_INIT'
const ACTION_FUNCTION = 'ACTION_FUNCTION'
export const AFTER_ACTION = Symbol('store#AFTER_ACTION')

const store = createStore(reducer)

function reducer(state, action) {
    switch (action.type) {
        case ACTION_INIT:
            return action.payload
        case ACTION_FUNCTION:
            return actionReducer(state, action.payload)
        default:
            return state
    }
}

export function init(initialState) {
    initialState = produce(initialState, s => actionReducer(s, {model: '', action: () => null, args: null}))
    store.dispatch({type: ACTION_INIT, payload: initialState})
}

export function getState() {
    return store.getState()
}

export function dispatch(model, action, args) {
    store.dispatch({type: 'ACTION_FUNCTION', payload: {model, action, args}})
}

export function subscribe(listener) {
    return store.subscribe(listener)
}

export function setValue() {
    throw Error(`
        Generic action for directly setting a value.
        Should never be called.
    `)
}

function execute(model, {action, task, request}) {
    task()
        .then(result => dispatch(model, action, {result, request}))
        .catch(error => {console.error(error); dispatch(model, action, {error, request})})
}

function actionReducer(state, {model, action, args}) {
    let tasks = []
    const newState = produce(state, s => {
        if (action === setValue) {
            setProperty(s, model, args)
        } else {
            const modelState = extractProperty(s, model)
            tasks.push(action(modelState, args))
        }
        callAfterActions(s)
    })
    tasks.filter(t => t).flat().forEach(t => execute(model, t))
    return newState
}

function callAfterActions(state) {
    if (state === null || typeof(state) !== 'object') {
        return
    }
    for (const key in state) {
        callAfterActions(state[key])
    }
    if (state[AFTER_ACTION]) {
        state[AFTER_ACTION]()
    }
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

