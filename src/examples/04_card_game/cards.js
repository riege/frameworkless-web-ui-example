const cards = {
    ATTACK: { name: 'Attack', damage: 6, description: 'Attack the enemy for 6 damage' },
    BLOCK: { name: 'Block', block: 6, description: 'Increase your block by 6' },
    DEFEND: { name: 'Defend', block: 4, damage: 3, description: 'Increase your block by 4 and attack the enemy for 3 damage' },
}
for (let k in cards) {
    cards[k] = Object.freeze(cards[k])
}
Object.freeze(cards)
export { cards }