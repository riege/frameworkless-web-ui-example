// custom elements
import "../example_view.js"
import "../01_counter/counter_view.js"
import "../02_synchronized_counters/synchronized_counter_view.js"
import "../03_synchronized_counter_list/synchronized_counter_list_view.js"
import "../04_card_game/game_view.js"
import "../05_order/order_view.js"

// models
import { CounterModel } from "../01_counter/counter_model.js"
import { SynchronizedCounterModel } from "../02_synchronized_counters/synchronized_counter_model.js"
import { SynchronizedCounterListModel } from "../03_synchronized_counter_list/synchronized_counter_list_model.js"
import { GameModel } from "../04_card_game/game_model.js"
import { init, getState, subscribe } from "../../base/store.js"
import { OrderModel } from '../05_order/order_model.js'


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
