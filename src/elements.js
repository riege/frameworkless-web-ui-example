import { html, render } from 'https://unpkg.com/lit-html?module'
import store from './store.js'

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
        this._update()
        store.subscribe(_ => this._update())
    }

    _update() {
        console.log('Update called')
        this.state = store.getState()
        const template = this.render()
        render(template, this)
    }

    render() {
        return html `Please implement ${this.constructor.name}.render()`
    }

}

customElements.define('example-view', ExampleView)