/* global immer */
immer.setAutoFreeze(true)
immer.enableMapSet()
export const immerable = immer.immerable
export default immer.produce