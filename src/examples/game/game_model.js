import cards from './cards.js'

const STATE_WELCOME = 'GAME_STATE_WELCOME'
const STATE_GAME = 'GAME_STATE_GAME'
const STATE_GAME_OVER = 'GAME_STATE_GAME_OVER'

const START_GAME = 'GAME_START_GAME'
const PLAY_CARD = 'GAME_PLAY_CARD'
const END_TURN = 'GAME_END_TURN'

function generateAction() {
    const names = ['willBlock', 'willAttack']
    const nameIndex = Math.floor(Math.random() * names.length)
    const name = names[nameIndex]
    const value = Math.floor(Math.random() * 7) + 3
    return { name, value }
}

function shuffle(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}

const gameModel = {

    deck() {
        const result = Array(13)
        result.fill(cards.ATTACK, 0, 5)
        result.fill(cards.BLOCK, 5, 10)
        result.fill(cards.DEFEND, 10, 13)
        return result
    },

    initialState() {
        return {
            state: STATE_WELCOME,
            round: 0,
            player: {
                hp: 100,
                mana: 3,
                block: 0,
            },
            enemy: {
                hp: 100,
                block: 0,
                willAttack: 0,
                willBlock: 0,
            },
            cards: {
                hand: [],
                draw: this.deck(),
                discard: [],
            }
        }
    },

    process(state, action) {
        if (!action) {
            console.error('process() called with undefind action')
        }
        if (!action.type) {
            console.error('process() called with undefined action type')
        }
        if (action.type === START_GAME) {
            Object.assign(state, this.initialState())
            state.state = STATE_GAME
            this.startTurn(state)
        }
        if (action.type === END_TURN) {
            this.takeDamage(state.player, state.enemy.willAttack)
            this.startTurn(state)
        }
        if (action.type === PLAY_CARD) {
            if (state.player.mana > 0) {
                const cardIndex = action.payload
                const card = state.cards.hand[cardIndex]
                state.cards.hand = state.cards.hand.filter((_, i) => i != cardIndex)
                state.cards.discard.push(card)
                this.takeDamage(state.enemy, card.damage ? card.damage : 0)
                state.player.block += card.block ? card.block : 0
                state.player.mana -= 1
            }
        }
    },

    startTurn(state) {
        this.generateEnemyAction(state.enemy)
        if (state.player.hp <= 0) {
            state.state = STATE_GAME_OVER
        }
        while (state.cards.hand.length > 0) {
            state.cards.discard.push(state.cards.hand.pop())
        }
        for (let i = 0; i < 5; i++) {
            if (state.cards.draw.length <= 0) {
                state.cards.draw = state.cards.discard
                shuffle(state.cards.draw)
                state.cards.discard = []
            }
            state.cards.hand.push(state.cards.draw.pop())
        }
    },

    takeDamage(character, damage) {
        const newBlock = character.block - damage
        if (newBlock < 0) {
            character.hp += newBlock
            character.block = 0
        } else {
            character.block = newBlock
        }
    },

    generateEnemyAction(enemy) {
        enemy.willAttack = 0
        enemy.willBlock = 0
        const parts = [generateAction(), generateAction()]
        parts.forEach(p => enemy[p.name] += p.value)
    }
}

export default gameModel
export {
    STATE_WELCOME,
    STATE_GAME,
    STATE_GAME_OVER,
    START_GAME,
    PLAY_CARD,
    END_TURN,
}