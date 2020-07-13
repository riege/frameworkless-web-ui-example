import store from '../base/store.js'
import { ReactiveElement } from '../base/elements.js'
import { html } from '../deps/lit-html.js'
import { SET_LIMIT } from './actionlog_model.js'

const setLimit = e => store.dispatch(SET_LIMIT, e.target.value)

class ActionLogView extends ReactiveElement {

    render() {
        return html `
            <label for="limit">Limit:</label>
            <input type="number" .value="${this.state.actionLog.limit}"
                                 @change="${setLimit}">

            <ol reversed start="${this.state.actionLog.count}">
                ${this.state.actionLog.log.map(this.actionLogItem)}
            </ol>
        `
    }

    actionLogItem(item) {
        return html `<li><pre>${item}</pre></li>`
    }
}
customElements.define('action-log-view', ActionLogView)