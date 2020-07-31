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
function executeTask(model, {action, task, request}) {
    task()
        .then(result => dispatch(model, action, {result, request}))
        .catch(error => {console.error(error); dispatch(model, action, {error, request})})
}

function actionReducer(state, action) {
    let tasks = []
    const newState = produce(state, mutableState => {
        executeAction(mutableState, action, tasks)
        callAfterActions(mutableState)
    })
    tasks.filter(t => t).flat().forEach(t => executeTask(action.model, t))
    return newState
}

function executeAction(mutableState, {model, action, args}, tasks) {
    if (action === setValue) {
        setProperty(mutableState, model, args)
    } else {
        const modelState = extractProperty(mutableState, model)
        tasks.push(action(modelState, args))
    }
}

function callAfterActions(mutableState) {
    if (mutableState === null || typeof(mutableState) !== 'object') {
        return
    }
    for (const key in mutableState) {
        callAfterActions(mutableState[key])
    }
    if (mutableState[AFTER_ACTION]) {
        mutableState[AFTER_ACTION]()
    }
}
