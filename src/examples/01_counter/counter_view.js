import { ReactiveElement } from '../../base/elements.js'
import { html } from '../../deps/lit-html.js'
import { increase, decrease, set } from './counter_model.js'

class CounterView extends ReactiveElement {

    render() {
        this.style.display = 'block'
        return html `
            <button @click="${this.eventHandler(increase)}">+</button>
            <input type="number" .value="${this.state && this.state.value}"
                                 @change="${this.eventHandler(set)}">
            <button @click="${this.eventHandler(decrease)}">-</button>
        `
    }
}

customElements.define('counter-view', CounterView)