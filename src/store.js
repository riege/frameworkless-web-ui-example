import { configureStore } from "./libs/redux-toolkit.esm.js";
import { shipments } from "./shipments/entity/ShipmentsReducer.js"

const reducer = {
    shipments
}
const config = {reducer};
const store = configureStore(config);
export default store;