// custom elements
import "./base/elements.js"
import "./examples/counter_view.js"
import "./examples/synchronized_counter_view.js"
import "./examples/synchronized_counter_list_view.js"
import "./examples/game/game_view.js"
import "./examples/order_view.js"

// models
import CounterModel from "./examples/counter_model.js"
import SynchronizedCounterModel from "./examples/synchronized_counter_model.js"
import SynchronizedCounterListModel from "./examples/synchronized_counter_list_model.js"
import GameModel from "./examples/game/game_model.js"
import {init, getState, subscribe} from "./base/store.js"
import { OrderModel } from './examples/order_model.js'


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
