import { SynchronizedCounterListModel, setSync } from '../src/examples/03_synchronized_counter_list/synchronized_counter_list_model.js'
import { checkModelClass } from './base_model.test.js'
import { increase, decrease, set } from '../src/examples/01_counter/counter_model.js'
import { expect } from './mocha.js'

describe('SynchronizedCounterListModel', function() {

    beforeEach(() => {
        this.state = new SynchronizedCounterListModel()
        this.testValue = (counter, expectedValue) => {
            expect(counter.value).to.equal(expectedValue)
        }
        this.testValueAll = (expectedValue) => {
            this.state.counters.forEach(counter => {
                this.testValue(counter, expectedValue)
            })
        }
        this.testAction = (counter, action, expectedValue, payload) => {
            action(counter, payload)
            this.testValue(counter, expectedValue)
        }
        this.testActionAll = (action, expectedValue, payload) => {
            this.state.counters.forEach(counter => {
                this.testAction(counter, action, expectedValue, payload)
            })
        }
        this.testAction(this.state.counterCounter, set, 6, 6)
    })

    checkModelClass(SynchronizedCounterListModel)
    checkModelClass(new SynchronizedCounterListModel().counterCounter.constructor)

    it('should have 0 as initial state', () => {
        this.testValueAll(0)
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

    it('should have as many counters as counterCounter says', () => {
        this.testAction(this.state.counterCounter, increase, 7)
        expect(this.state.counters.length).to.equal(7)
        this.testAction(this.state.counters[0], increase, 1)
        this.testAction(this.state.counters[6], increase, 1)
        this.testValue(this.state.counters[1], 0)
        this.testValue(this.state.counters[2], 0)
        this.testAction(this.state.counters[0], decrease, 0)

        this.testAction(this.state.counterCounter, decrease, 6)
        expect(this.state.counters.length).to.equal(6)
        this.testActionAll(decrease, -1)
        this.testAction(this.state.counters[0], decrease, -2)
        this.testAction(this.state.counters[3], set, 100, 100)
        this.testValue(this.state.counters[1], -1)
        this.testValue(this.state.counters[2], -1)
        this.testValue(this.state.counters[5], -1)

        this.testAction(this.state.counterCounter, set, 100, 100)
        expect(this.state.counters.length).to.equal(100)
        this.testAction(this.state.counters[96], increase, 1)

        this.testAction(this.state.counterCounter, set, 100, 100)
        expect(this.state.counters.length).to.equal(100)
        this.testAction(this.state.counters[96], increase, 2)

        this.testAction(this.state.counterCounter, set, 2, 2)
        expect(this.state.counters.length).to.equal(2)
        this.testValue(this.state.counters[0], -2)
        this.testValue(this.state.counters[1], -1)
    })

    it('should apply actions to all counters when synchronized', () => {
        // first, check that counters a not synchronized
        this.testAction(this.state.counters[0], set, 1, 1)
        this.testAction(this.state.counters[3], set, 2, 2)
        this.testAction(this.state.counters[5], set, 3, 3)
        this.testValue(this.state.counters[0], 1)
        this.testValue(this.state.counters[1], 0)
        this.testValue(this.state.counters[3], 2)
        this.testValue(this.state.counters[4], 0)

        // synchronize
        setSync(this.state, true)
        this.testValueAll(1)
        this.testAction(this.state.counterCounter, set, 10, 10)
        this.testValueAll(1)

        this.testAction(this.state.counters[1], increase, 2)
        this.testValueAll(2)

        this.testAction(this.state.counters[9], set, 6, 6)
        this.testValueAll(6)

        this.testAction(this.state.counters[4], decrease, 5)
        this.testValueAll(5)

        this.testAction(this.state.counterCounter, set, 8, 8)
        this.testValueAll(5)

        // unsynchronize
        setSync(this.state, false)
        // first counter retains synchronized value
        this.testValue(this.state.counters[0], 5)
        // others get their old value
        this.testValue(this.state.counters[1], 0)
        this.testValue(this.state.counters[2], 0)
        this.testValue(this.state.counters[3], 2)
        this.testValue(this.state.counters[5], 3)
        this.testValue(this.state.counters[7], 0)

        // lastly, check again that counters a not synchronized
        this.testAction(this.state.counters[0], set, 7, 7)
        this.testAction(this.state.counters[3], set, 8, 8)
        this.testAction(this.state.counters[5], set, 9, 9)
        this.testValue(this.state.counters[0], 7)
        this.testValue(this.state.counters[1], 0)
        this.testValue(this.state.counters[3], 8)
        this.testValue(this.state.counters[4], 0)
        this.testValue(this.state.counters[5], 9)
    })
})