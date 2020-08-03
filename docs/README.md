# Frameworkless Web UI

A demonstration of using web components and the lit-html library to create a reactive UI with unidirectional data flow.
The functionality is similar to the popular React and Vue frameworks, but is based entirely on web standards. No transpilation needed.

This experiment arose out of the Airhacks workshop "building applications with native web components, redux and lit-html".

## Running the examples

Due to strict cross-origin rules, opening the HTML files from the filesystem won't work properly. Instead, you'll need to start a web server that serves static files.

### Using Python 2 or 3 (macOS/Linux)

On macOS and Linux, you'll most likely have Python installed, so running one of the following commands in the root directory of this repository should just work:

    python2 -m SimpleHTTPServer
    python3 -m http.server

Then visit http://localhost:8000.

### Using Docker (Windows)

If you have Docker installed, run the following command from the root directory of this repository:

    docker run -dit --name frameworkless-web-ui -p 8000:80 -v "$PWD":/usr/local/apache2/htdocs/ httpd:2.4

Then visit http://localhost:8000.

## Basic principles of unidirectional data-flow

- the UI state is an immutable data structure
- the state is updated by dispatching actions
- the views are defined as pure functions that take the UI state as input and return the corresponding HTML

## Features of this demo

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

## Source code structure

All JavaScript code is organized into
[modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

### Directory structure

- `src/base` contains the plumbing that makes the unidirectional data-flow work
- `src/deps` contains the two dependencies needed
- `src/examples/*` contain the demo applications
- `test` contains unit tests

### Naming conventions

The following naming conventions are used for JS modules:

|| Convention || Description ||
| *_model.js |  Contains a UI model, consisting of state and actions
| *_view.js | Contains a custom element that provides a view for the model
| *_service.js | Contains asynchronous tasks (like HTTP requests) that are used by the model

## Recommended reading order

If many aspects of this demo are new to you, the following order is recommended for understanding the code:

1. Take a look at the examples in action if you haven't already
2. Read through this README file if you haven't already
3. Read the source code of the first example HTML `src/examples/01_counter/index.html`
3. Read the source code of the first model `src/examples/01_counter/counter_model.js`
3. Read the source code of the first view `src/examples/01_counter/counter_view.js`
4. Read the code in `src/base`, which provides the infrastructure for the examples, in alphabetical order
5. Continue with the rest of the examples

The source files contain detailed explanations written with this reading order in mind.
