import store from '../store.js'
import {ReactiveElement, StaticElement} from '../elements.js'
import {html} from 'https://unpkg.com/lit-html?module'

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
customElements.define('action-log-item', ActionLogItem)

class ActionLogView extends ReactiveElement {

    render() {
        return html`
            <ol>
                ${this.state.actionLog.map(action => html`<action-log-item item="${action}" .item="${action}"></action-log-item>`)}
            </ol>
        `
    }
}
customElements.define('action-log-view', ActionLogView)