import { expect } from './mocha.js'
import BaseModel from '../src/base/model.js'
import produce from '../src/deps/immer.js'
import {isDraft} from '../src/deps/immer.js'

class DerivedModel extends BaseModel { }

describe('BaseModel', () => {

    it('should be immerable', () => {
        const model = new BaseModel()
        produce(model, draftedModel => {
            expect(isDraft(draftedModel)).to.be.true
        })

        const derivedModel = new BaseModel()
        produce(derivedModel, draftedModel => {
            expect(isDraft(draftedModel)).to.be.true
        })
    })

})