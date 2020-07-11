import store from '../store.js'
import {ReactiveElement} from '../elements.js'
import {html} from 'https://unpkg.com/lit-html?module'

class ActionLogView extends ReactiveElement {

    render() {
        return html`
            <ol reversed start="${this.state.actionCount}">
                ${this.state.actionLog.map(this.actionLogItem)}
            </ol>
        `
    }

    actionLogItem(item) {
        return html`<li><pre>${item}</pre></li>`
    }
}
customElements.define('action-log-view', ActionLogView)