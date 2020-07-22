import { html, render } from '../deps/lit-html.js'
import {getState, dispatch, subscribe, getValidationResults} from './store.js'

export class ExampleView extends HTMLElement {

    connectedCallback() {
        const title = this.getAttribute('title')
        const template = html `
            <section>
                <h2>${title}</h2>
                <div .innerHTML="${this.innerHTML}"></div>
            </section>
        `
        render(template, this)
    }
}

export class ReactiveElement extends HTMLElement {

    connectedCallback() {
        this.model = this.getAttribute('model')
        this._update()
        subscribe(_ => this._update())
    }

    subModel(path) {
        return `${this.model}.${path}`
    }

    extractState(state) {
        const model = this.model
        return model ? model.split('.').reduce((o, p) => o ? o[p] : o, state) : state
    }

    get validationResults() {
        return getValidationResults(this.model)
    }

    get valid() {
        return this.validationResults.length <= 0
    }

    get validationMessage() {
        return this.validationResults.map(r => r.message).join()
    }

    get validationIcon() {
        return this.valid ? "✓" : "✗"
    }

    _update() {
        this.state = this.extractState(getState())
        if (this.state === undefined) {
            return
        }
        const template = this.render()
        render(template, this)
    }

    eventHandler(action) {
        return event => dispatch(this.model, action, event.target.value)
    }

    dispatch(action, args) {
        return event => {
            event.preventDefault()
            dispatch(this.model, action, args)
        }
    }

    dispatchChecked(action) {
        return event => dispatch(this.model, action, event.target.checked)
    }

    render() {
        return html `Please implement ${this.constructor.name}.render()`
    }

}

customElements.define('example-view', ExampleView)