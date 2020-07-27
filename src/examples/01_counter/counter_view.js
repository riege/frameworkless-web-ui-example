import { ReactiveElement } from '../../base/elements.js'
import { html } from '../../deps/lit-html.js'
import { increase, decrease, set } from './counter_model.js'

class CounterView extends ReactiveElement {

    render() {
        this.style.display = 'block'
        return html `
            <button @click="${this.dispatch(increase)}">+</button>
            <input type="number" .value="${this.state.value}"
                                 @change="${this.dispatchValue(set)}">
            <button @click="${this.dispatch(decrease)}">-</button>
        `
    }
}

customElements.define('counter-view', CounterView)
