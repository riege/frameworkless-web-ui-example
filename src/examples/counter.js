import store from '../store.js'
import {ReactiveElement} from '../elements.js'
import {html} from 'https://unpkg.com/lit-html?module'

class CounterView extends ReactiveElement {

    render() {
        this.style.display = 'block'
        return html`
            <button @click="${store.incrementCounter}">+</button>
            <input type="number" .value="${this.state.counter}" @change="${store.setCounter}">
            <button @click="${store.decrementCounter}">-</button>
        `
    }
}

customElements.define('counter-view', CounterView)