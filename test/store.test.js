import { CounterModel } from '../src/examples/01_counter/counter_model.js'
import { increase, decrease, set } from '../src/examples/01_counter/counter_model.js'
import { expect } from './mocha.js'
import { init, dispatch, getState } from '../src/base/store.js'
import { immerable } from '../src/deps/immer.js'

describe('store', function() {

    beforeEach(() => {
        init({counter: new CounterModel()})
        this.testAction = function(action, expectedValue, payload) {
            dispatch('counter', action, payload)
            expect(getState()).to.deep.equal({counter: { value: expectedValue }})
        }
    })

    it('should work with getters and setters from classes', () => {
        class MyState {
            constructor() {
                this[immerable] = true
                this.name = "world"
                this.x = 1
                this.y = 2
            }
            get message() { return `Hello, ${this.name}!`}
            get position() { return [this.x, this.y]}
            set position([x, y]) { this.x = x; this.y = y}
        }
        const state = new MyState()
        expect(state.message).to.equal('Hello, world!')
        init(state)
        expect(getState().message).to.equal('Hello, world!')

        dispatch('', s => { s.name = 'test' })
        expect(getState().name).to.equal('test')
        expect(getState().message).to.equal('Hello, test!')

        dispatch('', s => { s.position = [5,7] })
        expect(getState().x).to.equal(5)
        expect(getState().y).to.equal(7)

        expect(() => getState().x = 1).to.throw(TypeError)
        expect(getState().x).to.equal(5)
        expect(() => getState().position = [1,1]).to.throw(TypeError)
        expect(getState().x).to.equal(5)
        expect(getState().y).to.equal(7)
    })

    it('should have 0 as initial state', () => {
        expect(getState()).to.deep.equal({counter: { value: 0 }})
    })

    it('should add 1 on increment', () => {
        const action = increase
        this.testAction(action, 1)
        this.testAction(action, 2)
        this.testAction(action, 3)
    })

    it('should remove 1 on decrement', () => {
        const action = decrease
        this.testAction(action, -1)
        this.testAction(action, -2)
        this.testAction(action, -3)
    })

    it('should set the value on set', () => {
        const values = [1, 42, -4, 0, 102]
        for (const value of values) {
            this.testAction(set, value, value)
        }
    })
})