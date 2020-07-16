const counterModel = {

    initialState() {
        return { value: 0 }
    },

}

export function increase(state) {
    state.value += 1
}

export function decrease(state) {
    state.value -= 1
}

export function set(state, value) {
    state.value = value
}

export default counterModel