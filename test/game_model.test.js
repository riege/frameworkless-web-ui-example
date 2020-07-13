import { expect } from './mocha.js'
import gameModel from '../src/examples/game/game_model.js'
import * as gm from '../src/examples/game/game_model.js'
import cards from '../src/examples/game/cards.js'

function s(object) {
    return JSON.stringify(object, null, 4)
}

describe('gameModel', function() {

    beforeEach(() => {
        this.state = gameModel.initialState()
        this.performAction = (type, payload) => {
            gameModel.process(this.state, { type, payload })
        }
    })

    it('should have an inital state', () => {
        expect(this.state).to.deep.equal({
            state: gm.STATE_WELCOME,
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
                block: null,
                willAttack: null,
                willBlock: null,
            },
        })
    })

    describe('starting the game', () => {

        it('should set the state to a running game', () => {
            this.performAction(gm.START_GAME)
            expect(this.state.state).to.equal(gm.STATE_GAME)
        })

        it('should reset game properties to the initial state', () => {
            this.state.round = 10
            this.state.player.hp = -2
            this.state.enemy.hp = 10
            this.performAction(gm.START_GAME)
            expect(this.state.round).to.equal(0)
            expect(this.state.player.hp).to.equal(100)
            expect(this.state.enemy.hp).to.equal(100)
        })

    })

    describe('the enemy', () => {

        it('should plan a different action each round', () => {
            this.performAction(gm.START_GAME)
            const distinctActions = new Set()
            for (let i = 0; i < 100; i++) {
                const attack = this.state.enemy.willAttack
                const block = this.state.enemy.willBlock
                expect(attack || block).to.not.be.null
                expect(attack + block).to.be.below(20)
                const actionString = `a${attack}b${block}`
                distinctActions.add(actionString)
                this.performAction(gm.END_TURN)
            }
            expect(distinctActions.size).to.be.at.least(10)
        })

        it('should take 6 damage when playing an attack', () => {
            this.performAction(gm.START_GAME)
            expect(this.state.enemy.hp).to.equal(100)

            this.performAction(gm.PLAY_CARD, cards.ATTACK)
            expect(this.state.enemy.hp).to.equal(94)

            this.performAction(gm.PLAY_CARD, cards.BLOCK)
            this.performAction(gm.PLAY_CARD, cards.ATTACK)
            expect(this.state.enemy.hp).to.equal(88)
        })

        it('should loose block before health', () => {
            this.performAction(gm.START_GAME)
            this.state.enemy.block = 10

            this.performAction(gm.PLAY_CARD, cards.ATTACK)
            expect(this.state.enemy.hp).to.equal(100)
            expect(this.state.enemy.block).to.equal(4)

            this.performAction(gm.PLAY_CARD, cards.ATTACK)
            expect(this.state.enemy.hp).to.equal(98)
            expect(this.state.enemy.block).to.equal(0)
        })
    })

    describe('the player', () => {

        it('should receive damage when the enemy attacks', () => {
            this.performAction(gm.START_GAME)
            expect(this.state.player.hp).to.equal(100)

            this.state.enemy.willAttack = 5
            this.performAction(gm.END_TURN)
            expect(this.state.player.hp).to.equal(95)

            this.state.enemy.willAttack = 2
            this.performAction(gm.END_TURN)
            expect(this.state.player.hp).to.equal(93)
        })

        it('should lose block before health', () => {
            this.performAction(gm.START_GAME)
            this.state.player.block = 10

            this.state.enemy.willAttack = 5
            this.performAction(gm.END_TURN)
            expect(this.state.player.hp).to.equal(100)
            expect(this.state.player.block).to.equal(5)

            this.state.enemy.willAttack = 7
            this.performAction(gm.END_TURN)
            expect(this.state.player.hp).to.equal(98)
            expect(this.state.player.block).to.equal(0)
        })

        it('should receive block when playing block', () => {
            this.performAction(gm.START_GAME)
            expect(this.state.player.block).to.equal(0)

            this.performAction(gm.PLAY_CARD, cards.BLOCK)
            expect(this.state.player.block).to.equal(6)

            this.performAction(gm.PLAY_CARD, cards.BLOCK)
            expect(this.state.player.block).to.equal(12)

            this.performAction(gm.PLAY_CARD, cards.ATTACK)
            this.performAction(gm.PLAY_CARD, cards.BLOCK)
            expect(this.state.player.block).to.equal(18)
        })
    })

    describe('the game', () => {

        it('should end when player dies', () => {
            this.performAction(gm.START_GAME)
            this.state.player.hp = 5
            this.state.enemy.willAttack = 10
            this.performAction(gm.END_TURN)
            expect(this.state.state).to.equal(gm.STATE_GAME_OVER)
        })
    })
})