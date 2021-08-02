import BElement from "../../BElement.js";
import { html } from "../../libs/lit-html.js";
import './NormalizedAddress.js';

class NormalizedShipment extends BElement {

    extractState(reduxState) {
        console.log(this._entityID);
        return reduxState.shipments.entities?.entities
            ? reduxState.shipments.entities?.entities.shipment[this._entityID]
            : reduxState;
    }

    view() {
        return html`
            <h2>This is shipment (ID: ${this._entityID})</h2>
            <p>My Number: ${this.state.nummer}</p>
            <h3>Shipper</h3>
            <b-normalizedaddress .entityID="${this.state.shipper}"></b-normalizedaddress>
            <h3>Consignee</h3>
            <b-normalizedaddress .entityID="${this.state.consignee}"></b-normalizedaddress>
        `
     }

}
customElements.define("b-normalizedshipment", NormalizedShipment)
