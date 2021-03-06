import { getState } from './store.js'

export const VALIDATION_RESULTS = Symbol('validation#VALIDATION_RESULTS')

let lastState
let lastResults

export function getValidationResults(model) {
    const state = getState()
    if (lastState !== state) {
        lastResults = collectResults(state)
        lastState = state
    }
    return lastResults
        .filter(([key, _result]) => key.startsWith(model))
        .map(([_key, result]) => result)
    
}

function collectResults(state) {
    const resultList = []
    collectResultsRec(state, resultList, '')
    return resultList
}

function collectResultsRec(state, resultList, prefix) {
    if (state === null || typeof(state) !== 'object') {
        return
    }
    if (state[VALIDATION_RESULTS]) {
        addResultsWithPrefix(resultList, prefix, state[VALIDATION_RESULTS])
    }
    for (const key in state) {
        collectResultsRec(state[key], resultList, prefix + key + '.')
    }
}

function addResultsWithPrefix(resultList, prefix, results) {
    results.forEach(result => {
        const validationKey = prefix + result.key
        resultList.push([validationKey, result])
    })
}
