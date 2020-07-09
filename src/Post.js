import {html, render} from 'https://unpkg.com/lit-html?module';

export default class Post extends HTMLElement {

    constructor() {
        super()
        this.root = this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        const template = html`
            <style>header{background-color: #faf}</style>
            <header>${new Date}</header>
            So I was at the dentist the other day ...
        `
        render(template, this.root)
    }
}

customElements.define('blog-post', Post)