import { ReactiveElement } from '../../base/elements.js';
import '../components.js'
import { html } from '../../deps/lit-html.js';

class PostalAddressView extends ReactiveElement {
    render() {
        return html`
            <bound-textfield model="${this.subModel('name')}">Full name</bound-textfield>
            <bound-textfield model="${this.subModel('street')}">Street</bound-textfield>
            <bound-textfield model="${this.subModel('zipCode')}">ZIP code</bound-textfield>
            <bound-textfield model="${this.subModel('city')}">City</bound-textfield>
            <bound-textfield model="${this.subModel('country')}">Country</bound-textfield>
        `
    }
}
customElements.define('postal-address-view', PostalAddressView)
