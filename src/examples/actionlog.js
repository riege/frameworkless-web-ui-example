import store from '../store.js'
import {ReactiveElement, StaticElement} from '../elements.js'
import {html} from '../../deps/node_modules/lit-html/lit-html.js'

class ActionLogView extends ReactiveElement {

    static i = 0

    render() {
        ActionLogView.i++
        const template = html`<action-log-item .item="${ActionLogView.i}"></action-log-item>`
        return html`
            <ol>
                ${template}
                ${ActionLogView.i >= 2 ? template : ''}
                ${this.state.actionLog.map(action => html`<action-log-item item="${action}" .item="${action}"></action-log-item>`)}
            </ol>
        `
    }
}

class ActionLogItem extends StaticElement {
    set item(value) {
        this._item = value
        this.connectedCallback()
    }
    get item() {
        return this._item
    }
    render() {
        return html`<li><pre>${this._item}</pre></li>`
    }
}

customElements.define('action-log-view', ActionLogView)
customElements.define('action-log-item', ActionLogItem)