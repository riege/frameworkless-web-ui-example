import '../01_counter/counter_view.js'
import { ReactiveElement } from '../../base/elements.js'
import { html } from '../../deps/lit-html.js'

class SynchronizedCounterListView extends ReactiveElement {

    counter(index) {
        return html`
            <h5>Counter ${index+1}</h5>
            <counter-view
                model="${this.subModel(`counters.${index}`)}">
            </counter-view>`
    }

    counters(counters) {
        return counters.map((_c, i) => this.counter(i))
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
