import SynchronizedCounterModel, { setSync } from '../src/examples/synchronized_counter_model.js'
import {checkModelClass} from './base_model.test.js'
import { increase, decrease, set } from '../src/examples/counter_model.js'
import {expect} from './mocha.js'

describe('SynchronizedCounterModel', function() {

    beforeEach(() => {
        this.state = new SynchronizedCounterModel()
        this.testValue = (counter, expectedValue) => {
            expect(this.state[counter]).to.deep.equal({ value: expectedValue})
        }
        this.testAction = (counter, action, expectedValue, payload) => {
            action(this.state[counter], payload)
            this.testValue(counter, expectedValue)
        }
        this.testActionAll = (action, expectedValue, payload) => {
            ['counterA', 'counterB', 'counterC'].forEach(counter => {
                this.testAction(counter, action, expectedValue, payload)
            })
        }
    })

    checkModelClass(SynchronizedCounterModel)

    it('should have 0 as initial state', () => {
        expect(this.state.counterA).to.deep.equal({value: 0})
        expect(this.state.counterB).to.deep.equal({value: 0})
        expect(this.state.counterC).to.deep.equal({value: 0})
    })

    it('should add 1 on increment', () => {
        this.testActionAll(increase, 1)
        this.testActionAll(increase, 2)
        this.testActionAll(increase, 3)
    })

    it('should remove 1 on decrement', () => {
        this.testActionAll(decrease, -1)
        this.testActionAll(decrease, -2)
        this.testActionAll(decrease, -3)
    })

    it('should set the value on set', () => {
        const values = [1, 42, -4, 0, 102]
        for (const value of values) {
            this.testActionAll(set, value, value)
        }
    })

    it('should apply actions to all counters when synchronized', () => {
        // first, check that counters a not synchronized
        this.testAction('counterA', set, 1, 1)
        this.testAction('counterB', set, 2, 2)
        this.testAction('counterC', set, 3, 3)
        this.testValue('counterA', 1)
        this.testValue('counterB', 2)
        this.testValue('counterC', 3)

        // synchronize
        setSync(this.state, true)
        this.testValue('counterA', 1)
        this.testValue('counterB', 1)
        this.testValue('counterC', 1)

        this.testAction('counterA', increase, 2)
        this.testValue('counterB', 2)
        this.testValue('counterC', 2)

        this.testAction('counterB', set, 6, 6)
        this.testValue('counterA', 6)
        this.testValue('counterC', 6)

        this.testAction('counterC', decrease, 5)
        this.testValue('counterA', 5)
        this.testValue('counterB', 5)

        // unsynchronize
        setSync(this.state, false)
        // counterA retains synchronized value
        this.testValue('counterA', 5)
        this.testValue('counterB', 2)
        this.testValue('counterC', 3)

        // lastly, check again that counters a not synchronized
        this.testAction('counterA', set, 6, 6)
        this.testAction('counterB', set, 7, 7)
        this.testAction('counterC', set, 8, 8)
        this.testValue('counterA', 6)
        this.testValue('counterB', 7)
        this.testValue('counterC', 8)
    })
})