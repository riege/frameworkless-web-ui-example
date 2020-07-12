import store from '../base/store.js'
import { ReactiveElement } from '../base/elements.js'
import { html } from 'https://unpkg.com/lit-html?module'
import { INCREASE, DECREASE, SET } from './counter_model.js'

const increase = _e => store.dispatch(INCREASE)
const decrease = _e => store.dispatch(DECREASE)
const set = e => store.dispatch(SET, e.target.value)

class CounterView extends ReactiveElement {

    render() {
        this.style.display = 'block'
        return html `
            <button @click="${increase}">+</button>
            <input type="number" .value="${this.state.counter.value}"
                                 @change="${set}">
            <button @click="${decrease}">-</button>
        `
    }
}

customElements.define('counter-view', CounterView)