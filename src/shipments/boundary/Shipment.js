import BElement from "../../BElement.js";
import { html } from "../../libs/lit-html.js";
import './Address.js';

class Shipment extends BElement {

    constructor() {
        super();
        this._path = "shipments.shipment";
    }

    extractState(reduxState) {
        return this._path.split('.').reduce((o, i) => o[i], reduxState);
    }

    view() {
        const {nummer} = this.state;
        console.log(nummer);
        return html`
            <h1>shipment ${nummer}</h1>
            <hr/>
            <p>Shipper:</p>
            <b-address .path="${this._path}.shipper"></b-address>
            <hr/>
            <p>Consignee:</p>
            <b-address .path="${this._path}.consignee"></b-address>
        `;
    }

}

customElements.define('b-shipment', Shipment);