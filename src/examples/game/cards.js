const cards = {
    ATTACK: { name: 'Attack', damage: 6 },
    BLOCK: { name: 'Block', block: 6 },
    DEFEND: { name: 'Block', block: 4, damage: 3 },
}
for (let k in cards) {
    cards[k] = Object.freeze(cards[k])
}
Object.freeze(cards)
export default cards