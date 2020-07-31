import produce from '../deps/immer.js'
import { createStore } from '../deps/redux.js'
import { extractProperty, setProperty } from '../base/util.js'

const ACTION_INIT = 'ACTION_INIT'
const ACTION_FUNCTION = 'ACTION_FUNCTION'
export const AFTER_ACTION = Symbol('store#AFTER_ACTION')

const store = createStore(reducer)
const noopAction = {model: '', action: () => undefined, args: undefined}

function reducer(state, action) {
    switch (action.type) {
        case ACTION_INIT:
            return actionReducer(action.payload, noopAction)
        case ACTION_FUNCTION:
            return actionReducer(state, action.payload)
        default:
            return state
    }
}

export function init(initialState) {
    store.dispatch({type: ACTION_INIT, payload: initialState})
}

export function dispatch(model, action, args) {
    store.dispatch({type: ACTION_FUNCTION, payload: {model, action, args}})
}

export function getState() {
    return store.getState()
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

/* global console */
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
