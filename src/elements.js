import {html, render} from 'https://unpkg.com/lit-html?module';

export class ExampleView extends HTMLElement {

    constructor() {
        super()
    }

    connectedCallback() {
        const title = this.getAttribute('title')
        const template = html`
            <section>
                <h2>${title}</h2>
            </section>
        `
        render(template, this)
    }
}

customElements.define('example-view', ExampleView)