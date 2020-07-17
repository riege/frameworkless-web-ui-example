// custom elements
import "./base/elements.js"
import "./examples/counter_view.js"
import "./examples/synchronized_counter_view.js"
import "./examples/synchronized_counter_list_view.js"
import "./examples/game/game_view.js"

// models
import CounterModel from "./examples/counter_model.js"
import SynchronizedCounterModel from "./examples/synchronized_counter_model.js"
import SynchronizedCounterListModel from "./examples/synchronized_counter_list_model.js"
import GameModel from "./examples/game/game_model.js"
import store from "./base/store.js"
import {init, getState, subscribe} from "./base/store2.js"


// assign globals for easy access in the browser console
window.store = store
window.getState = getState

// show state changes in the browser console
subscribe(() => console.log(getState()))

// initialize the model tree
init({
    counterModelA: new CounterModel(),
    counterModelB: new CounterModel(),
    synchronizedCounterModel: new SynchronizedCounterModel(),
    synchronizedCounterListModel: new SynchronizedCounterListModel(),
    gameModel: new GameModel(),
})
