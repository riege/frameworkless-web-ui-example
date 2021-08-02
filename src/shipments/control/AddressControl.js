import { createAction, createNextState } from "../../libs/redux-toolkit.esm.js";
import store from "../../store.js";

export const resetNameAction = createAction("address/resetName");
export const resetName = (path) => {
    store.dispatch(resetNameAction({path}));
}
