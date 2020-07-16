import { ExampleView } from "./base/elements.js"
import "./examples/counter_view.js"
import CounterModel from "./examples/counter_model.js"
import "./examples/synchronized_counter_view.js"
import SynchronizedCounterModel from "./examples/synchronized_counter_model.js"
import "./examples/actionlog_view.js"
import "./examples/game/game_view.js"
import store from "./base/store.js"
import {init, getState, subscribe} from "./base/store2.js"


window.store = store
window.getState = getState

init({
    counterModelA: new CounterModel(),
    counterModelB: new CounterModel(),
    synchronizedCounterModel: new SynchronizedCounterModel(),
})

subscribe(() => console.log(getState()))
