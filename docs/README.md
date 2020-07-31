# Frameworkless Web UI

A demonstration of using web components and the lit-html library to create a reactive UI with unidirectional data flow.
The functionality is similar to the popular React and Vue frameworks, but is based entirely on web standards. No transpilation needed.

This experiment arose out of the Airhacks workshop "building applications with native web components, redux and lit-html".

The basic principles of unidirectional data-flow are

- the UI state is an immutable data structure
- the state is updated by dispatching actions
- the view is defined as a pure function of the UI state

The showcases demonstrate:

- separation into model (state and actions) and view
- unit tests for models
- databinding
- validation
- asynchronous tasks
- various modern web technologies
    - CSS grid layout
    - CSS transitions/animations
    - custom components
    - ES6 modules
    - using a CDN

The source code is separated into four categories:

- `src/base` contains the plumbing that makes the unidirectional data-flow work
- `src/deps` contains the two dependencies needed
- `src/examples/*` contain the demo applications
- `test` contains unit tests
