import { cards } from './cards.js'
import { immerable } from '../../deps/immer.js'

const STATE_WELCOME = 'GAME_STATE_WELCOME'
const STATE_GAME = 'GAME_STATE_GAME'
const STATE_GAME_OVER = 'GAME_STATE_GAME_OVER'
const STATE_VICTORY = 'GAME_STATE_VICTORY'

function generateAction() {
    const names = ['willBlock', 'willAttack']
    const factors = [1.5, 1.9]
    const i = Math.floor(Math.random() * names.length)
    const name = names[i]
    const factor = factors[i]
    const value = Math.floor((Math.random() * 4 + 5) * factor)
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

export class GameModel {
    constructor() {
        this[immerable] = true
        Object.assign(this, {
            state: STATE_WELCOME,
            turn: 0,
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
                draw: GameModel.deck(),
                discard: [],
            },
        })
    }

    static deck() {
        const result = Array(13)
        result.fill(cards.ATTACK, 0, 5)
        result.fill(cards.BLOCK, 5, 10)
        result.fill(cards.DEFEND, 10, 13)
        return result
    }

    startTurn(state) {
        state.turn += 1
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
        state.player.mana = 3
        state.player.block = 0
    }

    takeDamage(character, damage) {
        const newBlock = character.block - damage
        if (newBlock < 0) {
            character.hp += newBlock
            character.block = 0
        } else {
            character.block = newBlock
        }
    }

    generateEnemyAction(enemy) {
        enemy.willAttack = 0
        enemy.willBlock = 0
        const parts = [generateAction(), generateAction()]
        parts.forEach(p => enemy[p.name] += p.value)
    }

}

export function startGame(model) {
    Object.assign(model, new GameModel())
    model.state = STATE_GAME
    model.startTurn(model)
}

export function endTurn(model) {
    model.takeDamage(model.player, model.enemy.willAttack)
    model.enemy.block = model.enemy.willBlock
    model.startTurn(model)
}

export function playCard(model, cardIndex) {
    if (model.player.mana > 0) {
        const card = model.cards.hand[cardIndex]
        model.cards.hand = model.cards.hand.filter((_, i) => i != cardIndex)
        model.cards.discard.push(card)
        model.takeDamage(model.enemy, card.damage ? card.damage : 0)
        model.player.block += card.block ? card.block : 0
        model.player.mana -= 1
        if (model.enemy.hp <= 0) {
            model.state = STATE_VICTORY
        }
    }
}

export {
    STATE_WELCOME,
    STATE_GAME,
    STATE_GAME_OVER,
    STATE_VICTORY,
}