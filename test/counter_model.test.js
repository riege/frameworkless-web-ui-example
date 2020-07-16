import CounterModel from '../src/examples/counter_model.js'
import BaseModel from '../src/base/model.js'
import { increase, decrease, set } from '../src/examples/counter_model.js'
import {expect} from './mocha.js'

describe('counter_model', function() {

    beforeEach(() => {
        this.state = new CounterModel()
        this.testAction = function(action, expectedValue, payload) {
            action(this.state, payload)
            expect(this.state).to.deep.equal({ value: expectedValue })
        }
    })

    it('should be a model', () => {
        expect(this.state).to.be.an.instanceof(BaseModel)
    })

    it('should have 0 as initial state', () => {
        expect(this.state).to.deep.equal({ value: 0 })
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