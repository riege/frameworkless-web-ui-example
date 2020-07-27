// custom elements
import "./base/elements.js"
import "./examples/01_counter/counter_view.js"
import "./examples/02_synchronized_counters/synchronized_counter_view.js"
import "./examples/03_synchronized_counter_list/synchronized_counter_list_view.js"
import "./examples/04_card_game/game_view.js"
import "./examples/05_order/order_view.js"

// models
import { CounterModel } from "./examples/01_counter/counter_model.js"
import { SynchronizedCounterModel } from "./examples/02_synchronized_counters/synchronized_counter_model.js"
import { SynchronizedCounterListModel } from "./examples/03_synchronized_counter_list/synchronized_counter_list_model.js"
import { GameModel } from "./examples/04_card_game/game_model.js"
import { init, getState, subscribe } from "./base/store.js"
import { OrderModel } from './examples/05_order/order_model.js'


// assign globals for easy access in the browser console
window.getState = getState

// show state changes in the browser console
/* global console */
subscribe(() => console.log(getState()))

// initialize the model tree
init({
    counterModelA: new CounterModel(),
    counterModelB: new CounterModel(),
    synchronizedCounterModel: new SynchronizedCounterModel(),
    synchronizedCounterListModel: new SynchronizedCounterListModel(),
    gameModel: new GameModel(),
    orderModel: new OrderModel(),
})
