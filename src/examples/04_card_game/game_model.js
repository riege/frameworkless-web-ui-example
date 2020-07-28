import { deck } from './cards.js'
import { immerable } from '../../deps/immer.js'

const STATE_WELCOME = 'GAME_STATE_WELCOME'
const STATE_GAME = 'GAME_STATE_GAME'
const STATE_GAME_OVER = 'GAME_STATE_GAME_OVER'
const STATE_VICTORY = 'GAME_STATE_VICTORY'

const MANA_PER_TURN = 3

const BASE_STRENGTH = 5
const VARIANT_STRENGTH = 4
const BLOCK_FACTOR = 1.5
const ATTACK_FACTOR = 1.9

function generateAction() {
    const names = ['willBlock', 'willAttack']
    const factors = [BLOCK_FACTOR, ATTACK_FACTOR]
    const actionIndex = Math.floor(Math.random() * names.length)
    const name = names[actionIndex]
    const factor = factors[actionIndex]
    const value = Math.floor((Math.random() * VARIANT_STRENGTH + BASE_STRENGTH) * factor)
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
                mana: MANA_PER_TURN,
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
                draw: deck(),
                discard: [],
            },
        })
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
        state.player.mana = MANA_PER_TURN
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
