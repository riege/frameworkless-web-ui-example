import { createReducer } from "../../libs/redux-toolkit.esm.js"
import { initEntitiesAction } from "../control/NormalizedShipmentsControl.js";
import { normalize }  from "../../libs/normalizr.es.js";
import { shipment } from "../schema/shipment.js";

const initialState = {
    shipment:{
        id: 1234567,
        nummer: 42,
        shipper: {
            id: 1,
            name: "foo"
        },
        consignee: {
            id: 2,
            name: "bar"
        }
    },
    entities: {}
}

export const shipments = createReducer(initialState, (builder) => {
    builder.addCase(initEntitiesAction, (state) => {
        const normalized = normalize(state.shipment, shipment);
        console.log(normalized);
        state.entities = normalized;
    });
});

