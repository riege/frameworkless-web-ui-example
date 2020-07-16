import { ExampleView } from "./base/elements.js"
import "./examples/counter_view.js"
import counterModel from "./examples/counter_model.js"
import "./examples/actionlog_view.js"
import "./examples/game/game_view.js"
import store from "./base/store.js"
import {init} from "./base/store2.js"


window.store = store

init({counterModel, counterModel2: counterModel})