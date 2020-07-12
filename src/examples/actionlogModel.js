const SET_LIMIT = 'ACTION_MODEL_SET_LIMIT'

const actionlogModel = {
    initialState() {
        return {
            log: [],
            count: 0,
            limit: 10,
        }
    },
    process(state, action) {
        if (action.type === SET_LIMIT) {
            state.limit = action.payload
        }
        state.count += 1
        const rest = state.log.slice(0, state.limit - 1)
        state.log = [JSON.stringify(action), ...rest]
    },
}

export default actionlogModel
export { SET_LIMIT }