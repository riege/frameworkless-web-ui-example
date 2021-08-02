import BElement from "../../BElement.js";
import { html } from "../../libs/lit-html.js";
import { resetName } from "../control/AddressControl.js";

class Address extends BElement {

    view() {
        const { name } = this.state;
        return html`
            <p>Name: ${name}</p>
            <br/>
            <button @click="${e => this._triggerNameChange(e)}">Change The Name</button>
        `;
    }

    extractState(reduxState) {
        return this._path.split('.').reduce((o, i) => o[i], reduxState);
    }

    _triggerNameChange(e) {
        e.preventDefault();
        // this path mangling needs to go somewhere else
        resetName(this._path.substring(this._path.indexOf('.') + 1));
    }

}
customElements.define('b-address', Address)