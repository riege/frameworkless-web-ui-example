import counterModel from '../src/examples/counter_model.js'
import { INCREASE, DECREASE, SET } from '../src/examples/counter_model.js'

const expect = chai.expect

describe('counter_model', function() {

    beforeEach(() => {
        this.state = counterModel.initialState()
        this.testAction = function(action, expectedValue) {
            counterModel.process(this.state, action)
            expect(this.state).to.deep.equal({ value: expectedValue })
        }
    })

    it('should have 0 as initial state', () => {
        expect(this.state).to.deep.equal({ value: 0 })
    })

    it('should add 1 on increment', () => {
        const action = { type: INCREASE }
        this.testAction(action, 1)
        this.testAction(action, 2)
        this.testAction(action, 3)
    })

    it('should remove 1 on decrement', () => {
        const action = { type: DECREASE }
        this.testAction(action, -1)
        this.testAction(action, -2)
        this.testAction(action, -3)
    })

    it('should set the value on set', () => {
        const values = [1, 42, -4, 0, 102]
        for (const value of values) {
            const action = { type: SET, payload: value }
            this.testAction(action, value)
        }
    })
})