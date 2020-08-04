import { html, render } from '../deps/lit-html.js'
import { getState, dispatch, subscribe } from './store.js'
import { getValidationResults } from '../base/validation.js'
import { extractProperty } from './util.js'

/*
    The base class for all our elements that react to state changes.
    It extends the built-in HTMLElement class, which is necessary
    to be rendered by the browser.
    https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
*/
export class ReactiveElement extends HTMLElement {

    /*
        This callback is invoked by the browser when a
        custom element is inserted into the DOM.
    */
    connectedCallback() {
        /*
            In the counter example, we already saw that
            the counter-view element got a model attribute.

            Note that the value of an attribute of an HTML element
            is always a string, since HTML does not know
            other types.

            The value of the model attribute is a (possibly nested) path to
            the model in our global state tree, e.g.

            // state tree definition
            init({
                myApp: {
                    counter: new CounterModel(),
                    [...]
                }
            })
            // view definition
            <counter-view model="myApp.counter"></counter-view>
        */
        this.model = this.getAttribute('model')
        /*
            We need to call _update to initially render our element.
        */
        this._update()
        /*
            We add a listener to the store that will call _update
            whenever the state changes.
        */
        subscribe(_ => this._update())
    }

    // reactive rendering implementation

    /*
        A convenience method to bind a submodel.
        Let's say this model is bound to myApp,
        then subModel('counter') would return myApp.counter.

        This allows us to write something like this in our template:
        <counter-view model="${this.subModel('counter')"></counter-view>

        If we referred to the absolute path myApp.counter in our template, we
        could not nest the view in other views.
    */
    subModel(path) {
        return `${this.model}.${path}`
    }

    /*
        This method takes the global state object as an argument
        and extracts the part that is bound to this view.
    */
    extractState(state) {
        return extractProperty(state, this.model)
    }

    /*
        Renders the view after the state has changed.
    */
    _update() {
        /*
            Extract the state that corresponds to our
            model from the global state tree.
        */
        this.state = this.extractState(getState())
        /*
            If there is no state, skip rendering.
            This way, we are not relying on the state tree
            to be correctly initialized when we render.
        */
        if (this.state === undefined) {
            return
        }
        /*
            The render function is how views are defined.
            It is expected to return a lit-html template.
        */
        const template = this.render()
        /*
            The render function from lit-html does the heavy
            lifting of updating the DOM. It is also smart about
            re-using what already exists, such that small
            updates of the view perform well.
        */
        render(template, this)
    }

    /*
        This is implemented by subclasses.
    */
    render() {
        return html `Please implement ${this.constructor.name}.render()`
    }

    // helpers for binding actions

    /*
        The dispatch* family of methods create event handlers
        that can be bound to DOM elements.

        The simplest form, dispatch, creates a mapping of
        an event to an action with hard-coded arguments.
    */
    dispatch(action, args) {
        return event => {
            event.preventDefault()
            dispatch(this.model, action, args)
        }
    }

    /*
        dispatchValue creates an event handler that dispatches the given
        action with the value of the element that triggered the event.
        For example, when bound to an <input> element, the action is
        dispatched with the entered text as argument.
    */
    dispatchValue(action) {
        return event => dispatch(this.model, action, event.target.value)
    }

    /*
        dispatchChecked works similar to dispatchValue, but uses the
        checked property of the target element. This is useful
        for binding to checkboxes, which have a "checked" property instead
        of a "value" property.
    */
    dispatchChecked(action) {
        return event => dispatch(this.model, action, event.target.checked)
    }

    // helpers for binding validation results

    /*
        Various getters to get the validation state associated with this element.
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
    */
    get validationResults() {
        return getValidationResults(this.model)
    }

    get valid() {
        return this.validationResults.length <= 0
    }

    get validationMessage() {
        return this.validationResults.map(r => r.message).join()
    }

    get validationIcon() {
        return this.valid ? "✓" : "✗"
    }

}
