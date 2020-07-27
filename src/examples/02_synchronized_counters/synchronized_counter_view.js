import '../01_counter/counter_view.js'
import { ReactiveElement } from '../../base/elements.js'
import { html } from '../../deps/lit-html.js'
import { setSync } from './synchronized_counter_model.js'

class SynchronizedCounterView extends ReactiveElement {

    render() {
        return html`
            <counter-view model="${this.subModel('counterA')}"></counter-view>
            <counter-view model="${this.subModel('counterB')}"></counter-view>
            <counter-view model="${this.subModel('counterC')}"></counter-view>
            <input class="sync" type="checkbox"
                .checked="${this.state.synchronized}"
                @change="${this.dispatchChecked(setSync)}"
            >synchronize</input>
        `
    }
}
customElements.define('synchronized-counter-view', SynchronizedCounterView)
