import { ReactiveElement2 } from '../base/elements.js'
import {html} from '../deps/lit-html.js'
import { setSync, setListSync } from './synchronized_counter_model.js'

class SynchronizedCounterView extends ReactiveElement2 {

    counters(counters) {
    return counters.map((_c, i) => html`<h5>Counter ${i}</h5> <counter-view model="${this.subModel(`counters.${i}`)}"></counter-view>`)
    }

    render() {
        return html`
            <h3>Syncronized Individual Counters</h3>
            <counter-view model="${this.subModel('counterA')}"></counter-view>
            <counter-view model="${this.subModel('counterB')}"></counter-view>
            <counter-view model="${this.subModel('counterC')}"></counter-view>
            <input class="sync" type="checkbox"
                .checked="${this.state.synchronized}"
                @change="${this.dispatchChecked(setSync)}"
            >synchronize</input>

            <h3>Syncronized Counter List</h3>
            <h5>Number of counters</h5>
            <counter-view model="${this.subModel('counterCounter')}"></counter-view>
            <input class="sync" type="checkbox"
                .checked="${this.state.synchronizedList}"
                @change="${this.dispatchChecked(setListSync)}"
            >synchronize</input>
            ${this.counters(this.state.counters)}
        `
    }
}
customElements.define('synchronized-counter-view', SynchronizedCounterView)