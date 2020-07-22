import produce from '../deps/immer.js'

export const VALIDATOR = Symbol("store#VALIDATOR")

let state
let validationState
let validationResults
let listeners = []

export function init(initialState, validators) {
    state = produce(initialState, s => s)
    validationState = produce(validators, v => v)
    validate(validationState, state)
    listeners.forEach(f => f())
}

export function getState() {
    return state
}

export function getValidationResults(model) {
    return validationResults.filter(result => result.key.startsWith(model))
}

export function dispatch(model, action, args) {
    state = reducer(state, model, action, args)
    validate(validationState, state)
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

function validate(validationState, state, model) {
    if (validationState === null || typeof(validationState) !== 'object') {
        return
    }
    if (model === undefined) {
        validationResults = []
    }
    const validator = validationState[VALIDATOR]
    if (validator) {
        const results = validator.bind(validationState)(state)
        results?.forEach(result => {
            result.key = `${model}.${result.key}`
            validationResults.push(result)
        })
    }
    for (const key in validationState) {
        validate(validationState[key], state[key], model !== undefined ? `${model}.${key}` : key)
    }
    if (model === undefined) {
        validationResults = Object.freeze(validationResults)
    }
}

function validateModel(allResults, state, model) {
    const results = state[VALIDATOR](state)
    for (const result of results) {
        result.key = `${model}.${result.key}`
        allResults.push(result)
    }
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
