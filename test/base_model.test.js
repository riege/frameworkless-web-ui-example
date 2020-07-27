import { expect } from './mocha.js'
import produce, { isDraft } from '../src/deps/immer.js'

export function checkModelClass(modelClass) {

    it(`${modelClass.name} should be immerable`, () => {
        const model = new modelClass()
        produce(model, draftedModel => {
            expect(isDraft(draftedModel)).to.be.true
        })
    })

}
