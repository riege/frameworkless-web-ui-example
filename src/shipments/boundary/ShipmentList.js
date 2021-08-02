import BElement from "../../BElement.js";
import { html } from "../../libs/lit-html.js";
import { initEntities } from "../control/NormalizedShipmentsControl.js";
import './NormalizedShipment.js';

class ShipmentList extends BElement {

    view() {
        console.log(this.state);
        const wurst = '1234567';
        return html`
            <h2>Shipment List</h2>
            <button <button @click="${e => this._loadTheShipments(e)}">Load the Shipments</button>
            <hr/>
            <b-normalizedshipment .entityID="${wurst}"></b-normalizedShipment>
        `
    }

    _loadTheShipments(e) {
        e.preventDefault();
        console.log("loading shipments")
        initEntities();
    }

}

customElements.define('b-normalizedshipmentlist', ShipmentList);