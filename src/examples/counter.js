import store from '../store.js'
import {ReactiveElement} from '../elements.js'
import {html} from '../../deps/node_modules/lit-html/lit-html.js'

class CounterView extends ReactiveElement {

    render() {
        return html`
            <button @click="${store.incrementCounter}">+</button>
            <input type="number" .value="${this.state.counter}" @change="${store.setCounter}">
            <button @click="${store.decrementCounter}">-</button>
        `
    }
}

customElements.define('counter-view', CounterView)