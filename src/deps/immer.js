/* global immer */
immer.setAutoFreeze(true)
immer.enableMapSet()
export const immerable = immer.immerable
export const isDraft = immer.isDraft
export default immer.produce
