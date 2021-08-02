import { createAction } from "../../libs/redux-toolkit.esm.js";
import store from "../../store.js";

export const initEntitiesAction = createAction("initEntities");
export const initEntities = () => {
    store.dispatch(initEntitiesAction());
}
