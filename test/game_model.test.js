import { expect } from './mocha.js'
import { GameModel } from '../src/examples/04_card_game/game_model.js'
import * as gm from '../src/examples/04_card_game/game_model.js'
import { cards, deck } from '../src/examples/04_card_game/cards.js'

function s(object) {
    return JSON.stringify(object, null, 4)
}

describe('gameModel', function() {

    beforeEach(() => {
        this.state = new GameModel()
        this.performAction = (action, payload) => {
            action(this.state, payload)
        }
    })

    it('should have an inital state', () => {
        expect(this.state).to.deep.equal({
            state: gm.STATE_WELCOME,
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
                drawPile: deck(),
                discardPile: [],
            },
        })
    })

    describe('starting the game', () => {

        it('should set the state to a running game', () => {
            this.performAction(gm.startGame)
            expect(this.state.state).to.equal(gm.STATE_GAME)
        })

        it('should reset game properties to the initial state', () => {
            this.state.turn = 10
            this.state.player.hp = -2
            this.state.enemy.hp = 10
            this.performAction(gm.startGame)
            expect(this.state.turn).to.equal(1)
            expect(this.state.player.hp).to.equal(100)
            expect(this.state.enemy.hp).to.equal(100)
        })

    })

    describe('the enemy', () => {

        it('should plan a different action each round', () => {
            this.performAction(gm.startGame)
            const distinctActions = new Set()
            for (let i = 0; i < 100; i++) {
                const attack = this.state.enemy.willAttack
                const block = this.state.enemy.willBlock
                expect(attack || block).to.not.be.null
                expect(attack + block).to.be.below(40)
                const actionString = `a${attack}b${block}`
                distinctActions.add(actionString)
                this.performAction(gm.endTurn)
            }
            expect(distinctActions.size).to.be.at.least(10)
        })

        it('should take 6 damage when playing an attack', () => {
            this.performAction(gm.startGame)
            expect(this.state.enemy.hp).to.equal(100)
            this.state.cards.hand = [cards.ATTACK, cards.BLOCK, cards.ATTACK]

            this.performAction(gm.playCard, 2)
            expect(this.state.enemy.hp).to.equal(94)

            this.performAction(gm.playCard, 1)
            this.performAction(gm.playCard, 0)
            expect(this.state.enemy.hp).to.equal(88)
        })

        it('should loose block before health', () => {
            this.performAction(gm.startGame)
            this.state.enemy.block = 10
            this.state.cards.hand = [cards.ATTACK, cards.ATTACK]

            this.performAction(gm.playCard, 0)
            expect(this.state.enemy.hp).to.equal(100)
            expect(this.state.enemy.block).to.equal(4)

            this.performAction(gm.playCard, 0)
            expect(this.state.enemy.hp).to.equal(98)
            expect(this.state.enemy.block).to.equal(0)
        })

        it('should receive block at the end of the turn', () => {
            this.performAction(gm.startGame)
            this.state.enemy.willBlock = 10

            this.performAction(gm.endTurn)
            expect(this.state.enemy.block).to.equal(10)
        })

        it('should reset block at the end of the turn', () => {
            this.performAction(gm.startGame)
            this.state.enemy.willBlock = 0
            this.state.enemy.block = 10

            this.performAction(gm.endTurn)
            expect(this.state.enemy.block).to.equal(0)
        })
    })

    describe('the player', () => {

        it('should receive damage when the enemy attacks', () => {
            this.performAction(gm.startGame)
            expect(this.state.player.hp).to.equal(100)

            this.state.enemy.willAttack = 5
            this.performAction(gm.endTurn)
            expect(this.state.player.hp).to.equal(95)

            this.state.enemy.willAttack = 2
            this.performAction(gm.endTurn)
            expect(this.state.player.hp).to.equal(93)
        })

        it('should lose block before health', () => {
            this.performAction(gm.startGame)
            this.state.player.block = 10

            this.state.enemy.willAttack = 5
            this.performAction(gm.endTurn)
            expect(this.state.player.hp).to.equal(100)
            expect(this.state.player.block).to.equal(0)

            this.state.player.block = 5
            this.state.enemy.willAttack = 7
            this.performAction(gm.endTurn)
            expect(this.state.player.hp).to.equal(98)
            expect(this.state.player.block).to.equal(0)
        })

        it('should receive block when playing block', () => {
            this.performAction(gm.startGame)
            expect(this.state.player.block).to.equal(0)

            this.state.cards.hand = [cards.BLOCK, cards.ATTACK, cards.BLOCK]
            this.performAction(gm.playCard, 2)
            expect(this.state.player.block).to.equal(6)

            this.performAction(gm.playCard, 1)
            this.performAction(gm.playCard, 0)
            expect(this.state.player.block).to.equal(12)
        })

        it('should receive 3 mana at the start of the turn', () => {
            this.performAction(gm.startGame)
            this.state.player.mana = 1

            this.performAction(gm.endTurn)
            expect(this.state.player.mana).to.equal(3)

            this.performAction(gm.endTurn)
            expect(this.state.player.mana).to.equal(3)
        })
    })

    describe('the game', () => {

        it('should end when player dies', () => {
            this.performAction(gm.startGame)
            this.state.player.hp = 5
            this.state.enemy.willAttack = 10
            this.performAction(gm.endTurn)
            expect(this.state.state).to.equal(gm.STATE_GAME_OVER)
        })

        it('should end when enemy dies', () => {
            this.performAction(gm.startGame)
            this.state.enemy.hp = 10
            this.state.cards.hand = [cards.ATTACK, cards.ATTACK]
            this.performAction(gm.playCard, 0)
            expect(this.state.state).to.equal(gm.STATE_GAME)

            this.performAction(gm.playCard, 0)
            expect(this.state.state).to.equal(gm.STATE_VICTORY)
        })

        it('should play cards from the hand and discard them', () => {
            this.performAction(gm.startGame)
            expect(this.state.player.mana).to.equal(3)

            this.state.cards.hand = [cards.BLOCK, cards.ATTACK, cards.BLOCK, cards.ATTACK]
            this.performAction(gm.playCard, 3)
            expect(this.state.cards.hand).to.deep.equal([cards.BLOCK, cards.ATTACK, cards.BLOCK])
            expect(this.state.cards.discardPile).to.deep.equal([cards.ATTACK])
            expect(this.state.player.mana).to.equal(2)

            this.performAction(gm.playCard, 0)
            expect(this.state.cards.hand).to.deep.equal([cards.ATTACK, cards.BLOCK])
            expect(this.state.cards.discardPile).to.deep.equal([cards.ATTACK, cards.BLOCK])
            expect(this.state.player.mana).to.equal(1)
        })

        it('should not play a card when the player is out of mana', () => {
            this.performAction(gm.startGame)
            this.state.player.mana = 0

            this.state.cards.hand = [cards.BLOCK]
            this.performAction(gm.playCard, 0)
            expect(this.state.cards.hand).to.deep.equal([cards.BLOCK])
            expect(this.state.cards.discardPile).to.deep.equal([])
            expect(this.state.player.mana).to.equal(0)
            expect(this.state.player.block).to.equal(0)
        })

        it('should draw 5 cards from the draw pile when starting a turn', () => {
            this.performAction(gm.startGame)
            const fiveAttacks = () => Array(5).fill(cards.ATTACK)
            const fiveBlocks = () => Array(5).fill(cards.BLOCK)
            this.state.cards.hand = fiveBlocks()
            this.state.cards.drawPile = fiveAttacks().concat(fiveAttacks())

            this.performAction(gm.endTurn)
            expect(this.state.cards.discardPile).to.deep.equal(fiveBlocks())
            expect(this.state.cards.drawPile).to.deep.equal(fiveAttacks())
            expect(this.state.cards.hand).to.deep.equal(fiveAttacks())
        })

        it('should shuffle the discard pile into the draw pile when the draw pile is empty', () => {
            this.performAction(gm.startGame)
            const threeAttacks = () => Array(3).fill(cards.ATTACK)
            const threeBlocks = () => Array(3).fill(cards.BLOCK)
            const twoDefends = () => Array(2).fill(cards.DEFEND)
            this.state.cards.hand = threeAttacks().concat(twoDefends())
            this.state.cards.drawPile = threeBlocks()
            const permutations = new Set()

            for (let i = 0; i < 100; i++) {
                this.performAction(gm.endTurn)
                expect(this.state.cards.discardPile).to.deep.equal([])
                expect(this.state.cards.hand.length).to.equal(5)
                expect(this.state.cards.drawPile.length).to.equal(3)
                const permutation = this.state.cards.hand
                    .concat(this.state.cards.drawPile)
                    .map(c => c.name)
                    .join()
                permutations.add(permutation)
            }
            expect(permutations.size).to.be.above(25)
        })

        it('should have a deck with 13 cards', () => {
            this.performAction(gm.startGame)
            const deck = this.state.cards.drawPile.concat(this.state.cards.hand)
            const count = (card) => deck.filter(c => c == card).length

            expect(this.state.cards.hand.length).to.equal(5)
            expect(this.state.cards.drawPile.length).to.equal(8)
            expect(deck.length).to.equal(13)
            expect(count(cards.ATTACK)).to.equal(5)
            expect(count(cards.BLOCK)).to.equal(5)
            expect(count(cards.DEFEND)).to.equal(3)
        })

        it('should require deliberation from the player', () => {
            let player_wins = 0
            for (let i = 0; i < 100; i++) {
                this.performAction(gm.startGame)
                for (let j = 0; j < 10000 && this.state.state == gm.STATE_GAME; j++) {
                    this.performAction(gm.playCard, 0)
                    this.performAction(gm.playCard, 0)
                    this.performAction(gm.playCard, 0)
                    this.performAction(gm.endTurn)
                }
                if (this.state.state == gm.STATE_VICTORY) {
                    player_wins += 1
                }
            }
            expect(player_wins).to.be.below(10)
        })
    })
})
