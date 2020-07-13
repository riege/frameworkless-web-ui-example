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

const gameModel = {

    initialState() {
        return {
            state: STATE_WELCOME,
            round: 0,
            player: {
                hp: 100,
                mana: 3,
                block: 0,
                hand: [],
                draw: [],
                discard: [],
            },
            enemy: {
                hp: 100,
                block: 0,
                willAttack: 0,
                willBlock: 0,
            },
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
            this.generateEnemyAction(state.enemy)
        }
        if (action.type === END_TURN) {
            this.takeDamage(state.player, state.enemy.willAttack)
            this.generateEnemyAction(state.enemy)
            if (state.player.hp <= 0) {
                state.state = STATE_GAME_OVER
            }
        }
        if (action.type === PLAY_CARD) {
            const card = action.payload
            this.takeDamage(state.enemy, card.damage ? card.damage : 0)
            state.player.block += card.block ? card.block : 0
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