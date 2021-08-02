import { createReducer, nanoid } from "../../libs/redux-toolkit.esm.js"
import { resetNameAction } from "../control/AddressControl.js"

const initialState = {
    shipment:{
        nummer: 42,
        shipper: {
            name: "foo"
        },
        consignee: {
            name: "bar"
        }
    }
}

export const shipments = createReducer(initialState, (builder) => {
    builder.addCase(resetNameAction, (state, { payload: { path } }) => {
        let comps = path.split('.');
        // add a utility function for this
        // also need to take care of array indices
        let target = comps.slice(0, comps.length).reduce((a, k) => a[k], state)
        target['name'] = nanoid();
    });
});
