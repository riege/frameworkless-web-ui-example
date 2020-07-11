import {html, render} from '../../deps/node_modules/lit-html/lit-html.js'
import store from '../store.js'

export class ExampleView extends HTMLElement {

    connectedCallback() {
        const title = this.getAttribute('title')
        const template = html`
            <section>
                <h2>${title}</h2>
                <div .innerHTML="${this.innerHTML}"></div>
            </section>
        `
        render(template, this)
    }
}

export class StaticElement extends HTMLElement {

    connectedCallback() {
        window.setTimeout(() => {
        render(this.render(), this)
        }, 0)
    }

    render() {
        return html`Please implement ${this.constructor.name}.render()`
    }

}

export class ReactiveElement extends HTMLElement {

    connectedCallback() {
        window.setTimeout(() => {
        this._update()
        store.subscribe(_ => this._update())
        }, 0)
    }

    _update() {
        console.log('Update called')
        this.state = store.getState()
        const template = this.render()
        render(template, this)
    }

    render() {
        return html`Please implement ${this.constructor.name}.render()`
    }

}

customElements.define('example-view', ExampleView)