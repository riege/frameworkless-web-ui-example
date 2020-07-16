import { ReactiveElement2 } from '../base/elements.js'
import {html} from '../deps/lit-html.js'
import { enableSync, disableSync, setSync } from './synchronized_counter_model.js'

class SynchronizedCounterView extends ReactiveElement2 {

    render() {
        return html`
            <counter-view model="${this.subModel('counterA')}"></counter-view>
            <counter-view model="${this.subModel('counterB')}"></counter-view>
            <counter-view model="${this.subModel('counterC')}"></counter-view>
            <input class="sync" type="checkbox"
                .checked="${this.state.synchronize}"
                @change="${this.dispatchChecked(setSync)}"
            >synchronize</input>
        `
    }
}
customElements.define('synchronized-counter-view', SynchronizedCounterView)