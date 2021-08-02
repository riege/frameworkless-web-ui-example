import BElement from "../../BElement.js";
import { html } from "../../libs/lit-html.js";

class NormalizedAddress extends BElement {

    extractState(reduxState) {
        return reduxState.shipments.entities?.entities
            ? reduxState.shipments.entities?.entities.addresses[this._entityID]
            : reduxState;
    }

    view() {
        return html`
            <h2>This is address (ID: ${this.entityID})</h2>
            <p>Name: ${this.state.name}</p>
        `
     }

}
customElements.define("b-normalizedaddress", NormalizedAddress)