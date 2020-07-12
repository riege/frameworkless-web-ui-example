const counterModel = {

    initialState() {
        return { value: 0 }
    },

    process(state, action) {
        switch (action.type) {
            case 'COUNTER_INCREASE':
                state.value += 1
                break
            case 'COUNTER_DECREASE':
                state.value -= 1
                break
            case 'COUNTER_SET':
                state.value = action.value
                break
        }
    }
}
export default counterModel