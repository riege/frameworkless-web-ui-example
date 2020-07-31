import produce from '../deps/immer.js'
import { extractProperty, setProperty } from '../base/util.js'

export const AFTER_ACTION = Symbol('store#AFTER_ACTION')

let state
let listeners = []

export function init(initialState) {
    const noopAction = { model: '', action: () => undefined }
    state = actionReducer(initialState, noopAction)
    listeners.forEach(f => f())
}

export function dispatch(model, action, args) {
    state = actionReducer(state, { model, action, args})
    listeners.forEach(f => f())
}

export function getState() {
    return state
}

export function subscribe(listener) {
    listeners.push(listener)
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
