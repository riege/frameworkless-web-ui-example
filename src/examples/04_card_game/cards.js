const cards = {
    ATTACK: { name: 'Attack', damage: 6, description: 'Attack the enemy for 6 damage' },
    BLOCK: { name: 'Block', block: 6, description: 'Increase your block by 6' },
    DEFEND: { name: 'Defend', block: 4, damage: 3, description: 'Increase your block by 4 and attack the enemy for 3 damage' },
}
for (let k in cards) {
    Object.freeze(cards[k])
}
Object.freeze(cards)

function deck() {
    const result = Array(13)
    result.fill(cards.ATTACK, 0, 5)
    result.fill(cards.BLOCK, 5, 10)
    result.fill(cards.DEFEND, 10, 13)
    return result
}

export { cards, deck }
