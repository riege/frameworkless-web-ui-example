const actionlogModel = {
    initialState() {
        return {
            log: [],
            count: 0,
            limit: 10,
        }
    },
    process(state, action) {
        state.count += 1
        const rest = state.log.slice(0, state.limit - 1)
        state.log = [JSON.stringify(action), ...rest]
    },
}
export default actionlogModel