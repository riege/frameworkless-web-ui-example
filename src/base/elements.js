import { html, render } from '../deps/lit-html.js'
import { getState, dispatch, subscribe } from './store.js'
import { getValidationResults } from '../base/validation.js'
import { extractProperty } from './util.js'

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
        return extractProperty(state, this.model)
    }

    _update() {
        this.state = this.extractState(getState())
        if (this.state === undefined) {
            return
        }
        const template = this.render()
        render(template, this)
    }

    dispatchValue(action) {
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

}
