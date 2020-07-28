import '../01_counter/counter_view.js'
import '../components.js'
import { ReactiveElement } from '../../base/elements.js'
import { html } from '../../deps/lit-html.js'

class SynchronizedCounterView extends ReactiveElement {

    render() {
        return html`
            <counter-view model="${this.subModel('counterA')}"></counter-view>
            <counter-view model="${this.subModel('counterB')}"></counter-view>
            <counter-view model="${this.subModel('counterC')}"></counter-view>
            <bound-checkbox model="${this.subModel('synchronized')}">synchronize</bound-checkbox>
        `
    }
}
customElements.define('synchronized-counter-view', SynchronizedCounterView)
