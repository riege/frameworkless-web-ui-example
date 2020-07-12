const INCREASE = 'COUNTER_INCREASE'
const DECREASE = 'COUNTER_DECREASE'
const SET = 'COUNTER_SET'

const counterModel = {

    initialState() {
        return { value: 0 }
    },

    process(state, action) {
        switch (action.type) {
            case INCREASE:
                state.value += 1
                break
            case DECREASE:
                state.value -= 1
                break
            case SET:
                state.value = action.payload
                break
        }
    }
}

export default counterModel
export { INCREASE, DECREASE, SET }