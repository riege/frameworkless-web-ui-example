/*
    This is the import syntax first defined in the ECMAScript 6 standard.
    ECMAScript is the language specification behind JavaScript.
    See https://hacks.mozilla.org/2015/08/es6-in-depth-modules/ for a nice
    introduction to the module syntax and semantics.

    We use the immer library to create immutable data structures. This will
    be explained in more detail in src/store.js.
*/
import { immerable } from '../../deps/immer.js'

/*
    The model defines the state for a counter.

    The class syntax was introduced in ECMAScript 2015.
    It is syntactic sugar for the prototype-based inheritance
    that has long been a part of JavaScript.

    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
*/
export class CounterModel {
    constructor() {
        /*
            This flag is a marker for the immer library that this class
            is allowed to be copied. Classes are required to explicitly
            signal compatibility with immer, otherwise they won't be
            deep-copied.
        */
        this[immerable] = true

        /*
            This is the actual state that our counter needs.
        */
        this.value = 0
    }
}

/*
    These functions are the actions that will update our model.
    They are defined as regular functions instead of methods,
    because they are intended to be passed around as values.
    This is awkward to do with methods, because the semantics of
    this-binding in JavaScript are much more complicated
    than simply passing a parameter to a function.
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
*/
export function increase(state) {
    state.value += 1
}

/*
    Note that action functions expect the state to be mutable.

    These functions are not intended to be called directly, since the
    state of our application is immutable. Instead, they are given
    to the dispatch function from the src/base/store.js module, e.g.
    dispatch('counterModelA', increase).

    When an action is dispatched, the store creates a mutable copy of the
    current state, applies the action, and then freezes the result, creating
    a new immutable state.

    Freezing an object is a standard JavaScript functionality, see
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
*/
export function decrease(state) {
    state.value -= 1
}

/*
    An action function gets two parameters.

    The first one is the current state (normally an instance of our model class).
    The second one is an arbitrary object that holds the argument or arguments
    for our action. In this case, it is the now value for our counter.
*/
export function set(state, value) {
    state.value = value
}
