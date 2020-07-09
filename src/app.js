import {html, render} from 'https://unpkg.com/lit-html?module';
import { getMessageFromServer } from "./blogservice.js";
import Post from "./Post.js"

class BlogView extends HTMLElement {

    constructor() {
        super()
        console.log('constructor called');
        
    }

    connectedCallback() {
        console.log('initializing ...');
        const template = html`my blog ${this.getAttribute('title')}
        <blog-post></blog-post>
        <pre>${getMessageFromServer()}</pre>
        ${this.innerHTML}`
        render(template, this)
    }
}


customElements.define('blog-view', BlogView)
