export default class Post extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            So I was at the dentist the other day ...
        `
    }
}

customElements.define('blog-post', Post)