import produce from '../deps/immer.js'
import { extractProperty, setProperty } from './util.js'

/*
    The store module is the linchpin of the architecture that we are using.
    It holds the state for the whole application in a single, immutable object.

    It provides facilities to update the state via actions
    as well as react to updates via listeners.
*/

/*
    This symbol is used by models to provide arbitrary callbacks that are
    invoked after any action is performed.
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
*/
export const AFTER_ACTION = Symbol('store#AFTER_ACTION')

/*
    The current state.
*/
let state

/*
    Listeners that are invoked when the state is updated.
*/
let listeners = []

/*
    The init function initializes the store to the given initial state.
*/
export function init(initialState) {
    /*
        A dummy action that does nothing.
    */
    const noopAction = { model: '', action: () => undefined }
    /*
        We cannot just set `state = initialState` for two reasons:

            1. We want an immutable version of the state
            2. We need to run the action callbacks to properly initialize all
               models and validation
        
        The following code does *almost* the same as a regular dispatch,
        except that the given initialState is used instead of the current
        state (which is assumedly undefined at this point)
    */
    state = actionReducer(initialState, noopAction)
    listeners.forEach(f => f())
}

/*
    A dispatch
        1. derives a new state by applying the dispatched action to the current state
        2. invokes all registered listeners
*/
export function dispatch(model, action, args) {
    state = actionReducer(state, { model, action, args})
    /*
        Listeners are invoked without arguments. This conforms
        to the way Redux would do it.

        We could give them the new state as argument, but they don't really
        need that, since the state is available globally.

        If our application needed it, we could give more parameters here,
        e.g. the old state, new state, and the action that was invoked.
    */
    listeners.forEach(f => f())
}

/*
    The one and only way to get the application state.
*/
export function getState() {
    return state
}

/*
    Registers a listener that is invoked after the state has changed.
*/
export function subscribe(listener) {
    listeners.push(listener)
}

/*
    This is a generic action to set a value. In many cases,
    we just want to update a property to the value of a DOM element.
*/
export function setValue() {
    /*
        This isn't intended to be executed. We'll see an explanation later
        on.
    */
    throw Error(`
        Generic action for directly setting a value.
        Should never be called.
    `)
}

/*
    actionReducer takes a state and an action and produces
    a new state. The name "reducer" is commonly used in Redux
    and stems from the "reduce" function that is seen in
    many programming languages to aggregate lists, e.g.
    https://docs.oracle.com/javase/tutorial/collections/streams/reduction.html#reduce

    Note that this reducer is not a pure function. We could return the tasks
    instead of executing them directly and move the execution to the caller,
    but that actually makes the code less readable.
*/
function actionReducer(state, action) {
    /*
        In addition to modifying the state, an action is allowed to return
        tasks. These are asynchronous actions that are executed by the store.

        Because the actions do not execute the tasks themselves, they stay
        pure and can be properly tested without mocks.
    */
    let tasks = []

    /*
        This is where we use the immer library to create immutable objects.
        Immer doesn't just deep-copy the object to make it mutable; it uses
        a copy-on-write mechanism for performance.
        https://immerjs.github.io/immer/docs/introduction

        The great thing about immer, as compared to classical immutable data
        structures is that it allows our actions to use all the built-in
        features of JavaScript that only work on mutable objects.
    */
    const newState = produce(state, mutableState => {
        /*
            We execute the action, meaning it's invoked
            with a mutable copy of the state as parameter.
        */
        executeAction(mutableState, action, tasks)
        /*
            We call the after actions that are defined by models. These after
            actions also get the mutable copy of the state to be able to
            change or add properties. In these examples, they are used to
            generate and update validation results on models.
        */
        callAfterActions(mutableState)
    })
    /*
        The list of tasks may contain
            1. undefined values
            2. single tasks
            3. lists of tasks
        We first filter all falsy values, then flatten all sublists, and
        finally start the execution of each task
    */
    tasks.filter(t => t).flat().forEach(t => executeTask(action.model, t))
    return newState
}

function executeAction(mutableState, {model, action, args}, tasks) {
    if (action === setValue) {
        /*
            The setValue action is special, because it replaces
            the model it's invoked upon with the argument.

            This way, we can bind directly to properties that hold
            plain values instead of objects.
        */
        setProperty(mutableState, model, args)
    } else {
        /*
            Extract the sub-state that the action was dispatched to. Note
            that the `model` variable contains the path to a model, not the
            model itself, e.g. the string 'app.counter'
        */
        const modelState = extractProperty(mutableState, model)
        /*
            Invoke the action function on the modelState with the given
            arguments. The result is then pushed to the list of tasks to
            execute.
        */
        tasks.push(action(modelState, args))
    }
}

/*
    After actions allow models to do housekeeping after an action is invoked.
    We use that to run validations, but it would be possible to do other
    useful things like synchronizing a property between submodels.
*/
function callAfterActions(mutableState) {
    /*
        The base case; if the argument isn't an object, we are done.
    */
    if (mutableState === null || typeof(mutableState) !== 'object') {
        return
    }
    /*
        For a regular object, recursively descend into all enumerable
        properties.
    */
    for (const key in mutableState) {
        callAfterActions(mutableState[key])
    }
    /*
        We call the after action *after* we have descended into sub-models.
        This is important to allow a model to be able to override the
        behaviour of a sub-model.
    */
    if (mutableState[AFTER_ACTION]) {
        mutableState[AFTER_ACTION]()
    }
}

/*
    Tasks consist of an asynchronous function, an action to dispatch after
    completion, and an optional request object that allows the originator
    of the task to identify it (e.g. in case of parallel HTTP requests,
    we'd need to decide which response is newer)

    Asynchronous functions are a JS language feature. They return a promise
    as result.
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

    Task execution consists of calling the asynchronous function and adding
    fulfillment and rejection handlers via then/catch. These completion
    handlers will then dispatch the given action, so the model that started
    the task is updated with the result of the task.

    As an analogy to tasks in Scope, the asynchronous function
*/
/* global console */
function executeTask(model, {action, task, request}) {
    task()
        .then(result => dispatch(model, action, {result, request}))
        .catch(error => {console.error(error); dispatch(model, action, {error, request})})
}
