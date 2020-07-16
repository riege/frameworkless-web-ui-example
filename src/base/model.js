import {immerable} from '../deps/immer.js'

export default class BaseModel {
    constructor() {
        this[immerable] = true
    }
}