import { ReactiveElement } from '../base/elements.js'
import { html } from '../deps/lit-html.js'
import { setValue } from '../base/store.js'

class BoundTextfield extends ReactiveElement {

    constructor() {
        super()
        this.name = this.innerText
    }

    render() {
        return html`
            <label for="${this.name}">${this.name}:</label>
            <input type="text"
                   name="${this.name}"
                   .value="${this.state}"
                   @change="${this.dispatchValue(setValue)}">
            <div class="validation validation-${this.valid ? 'ok' : 'error'}">
                <div class="validation-icon">${this.validationIcon}</div>
                <div class="validation-message">${this.validationMessage}</div>
            </div>
        `
    }
}
customElements.define('bound-textfield', BoundTextfield)

class BoundCheckbox extends ReactiveElement {

    render() {
        return html`
            <input type="checkbox"
                .checked="${this.state}"
                @change="${this.dispatchChecked(setValue)}"
            >${this.innerText}</input>
        `
    }
}
customElements.define('bound-checkbox', BoundCheckbox)

class BoundSelect extends ReactiveElement {

    constructor() {
        super()
        this.name = this.innerText
        this.options = []
    }

    renderOption([name, value]) {
        return html`<option value="${value}">${name}</option>`
    }

    render() {
        return html`
            <label for="${this.name}">${this.name}:</label>
            <select name="${this.name}"
                   .value="${this.state}"
                   @change="${this.dispatchValue(setValue)}">
                   ${this.options.map(this.renderOption)}
            </select>
        `
    }
}
customElements.define('bound-select', BoundSelect)
