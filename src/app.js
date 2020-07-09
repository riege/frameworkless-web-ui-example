import { getMessageFromServer } from "./blogservice.js";
import Post from "./Post.js"

class BlogView extends HTMLElement {

    constructor() {
        super()
        console.log('constructor called');
        
    }

    connectedCallback() {
        console.log('initializing ...');
        this.innerHTML = `my blog ${this.getAttribute('title')}
        <blog-post></blog-post>
        <pre>${getMessageFromServer()}</pre>
        ${this.innerHTML}`
        const button = this.querySelector('button')
        button.onclick = _ => this.appendChild(new Post())
    }
}


customElements.define('blog-view', BlogView)
