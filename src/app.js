import { ExampleView } from "./elements.js"
import "./examples/counter_view.js"
import "./examples/actionlog_view.js"
import store from "./store.js"

window.store = store
console.log('Store initialized to ', store.getState())
store.subscribe(_ => console.log('Store changed to ', store.getState()))