import { ReactiveElement } from '../../base/elements.js'
import { html } from '../../deps/lit-html.js'
import { increase, decrease, set } from './counter_model.js'

/*
    All our views extend the ReactiveElement base class.
    This class listens to changes in our state
    and re-renders our element when the state changes.

    It also offers utility methods for binding data and actions.
*/
class CounterView extends ReactiveElement {

    /*
        The render method is called by the superclass each time the
        state changes.
    */
    render() {
        /*
            We return an HTML template derived from the current state,
            which is accessible via `this.state`.

            The templating mechanism is provided by the lit-html library,
            our second dependency, via a standard JS functionality called
            "tagged templates".
            https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates

            More detail on the templating and rendering is explained in
            src/base/elements.js.
        */
        return html `
            <!--
                We create a button that will dispatch the increase action when clicked
                The @click syntax is provided by lit-html. It allows us to bind events
                directly to functions. This is different to using the onclick attribute
                in HTML, which can only take a string. The practical difference is that
                the function we are binding to does not need a globally defined name.
            -->
            <button @click="${this.dispatch(increase)}">+</button>
            <!--
                We use a number field. Here is another special syntax from lit-html,
                binding the value property of the input field to the value property
                of our counter state.
            -->
            <input type="number" .value="${this.state.value}"
                                 @change="${this.dispatchValue(set)}">
            <!--
                The decrease button is bound to the decrease action.
                Nothing new here.
            -->
            <button @click="${this.dispatch(decrease)}">-</button>
        `
    }
}
/*
    The customElements global variable is the entry point to the
    custom elements API, a part of the Web Components specification.
    https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
*/
customElements.define('counter-view', CounterView)
