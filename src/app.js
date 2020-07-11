import {html, render} from 'https://unpkg.com/lit-html?module';
import "./elements.js"

const hello = function(state = {name: "world"}, message) {
    const { type, payload } = message
    switch (type) {
        case 'set': return { name: payload }
        default: return state
    }
}

const store = Redux.createStore(hello)

store.subscribe(_ => console.log(store.getState()))
store.dispatch({type: 'xxx', payload: 'muli'})
store.dispatch({type: 'set', payload: 'muli'})