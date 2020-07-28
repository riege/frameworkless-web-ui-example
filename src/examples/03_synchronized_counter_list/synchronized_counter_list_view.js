import '../01_counter/counter_view.js'
import { ReactiveElement } from '../../base/elements.js'
import { html } from '../../deps/lit-html.js'

class SynchronizedCounterListView extends ReactiveElement {

    counters(counters) {
        return counters.map((_c, i) => html`<h5>Counter ${i}</h5> <counter-view model="${this.subModel(`counters.${i}`)}"></counter-view>`)
    }

    render() {
        return html`
            <h5>Number of counters</h5>
            <counter-view model="${this.subModel('counterCounter')}"></counter-view>
            <bound-checkbox model="${this.subModel('synchronized')}">synchronize</bound-checkbox>
            ${this.counters(this.state.counters)}
        `
    }
}
customElements.define('synchronized-counter-list-view', SynchronizedCounterListView)
