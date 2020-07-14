import { ReactiveElement } from '../../base/elements.js'
import { html, render } from '../../deps/lit-html.js'
import store from '../../base/store.js'
import gameModel, { STATE_VICTORY } from './game_model.js'
import { START_GAME, PLAY_CARD, END_TURN, STATE_WELCOME, STATE_GAME, STATE_GAME_OVER } from './game_model.js'
import c from './cards.js'

function characterStats(char) {
    const row = (name, val) => html `<tr class="${name}"><td>${name}:</td><td>${val}</td></tr>`
    return html `
        <table class="character-stats">
            ${row('Health', char.hp)}
            ${row('Block', char.block)}
            ${row('Mana', char.mana)}
        </table>
    `
}

function player(player) {
    return html `
        <div class="character-model player-model">
            <h1>Player</h1>
            <div class="player-stats">
                ${characterStats(player)}
            </div>
        </div>
        `
}

function enemy(enemy) {
    return html `
        <div class="character-model enemy-model">
            <h1>Enemy</h1>
            <div class="enemy-intent">
            The enemy plans to
            ${enemyIntent('Attack', enemy.willAttack)}
            ${enemyIntent('Block', enemy.willBlock)}
            ${enemyIntent('do nothing', !(enemy.willBlock || enemy.willAttack))}
            </div>
            <div class="enemy-stats">
                ${characterStats(enemy)}
            </div>
        </div>
        `
}

function enemyIntent(action, value) {
    if (!value) {
        return null
    }
    return html `<p class="enemy-intent-${action}">${action} ${typeof(value) === 'number' ? value : ''}</p>`
}

function cards(hand, cssClass) {
    return html `
        <div class="player-hand ${cssClass}">
            ${hand.map(card)}
        </div>
    `
}

function card(card, index) {
    const playCard = () => store.dispatch(PLAY_CARD, index)
    return html `
        <div class="card card-${index} card-${card.name}" @click="${playCard}">
            <h1>${card.name}</h1>
            <p>
                ${card.description}
            </p>
        </div>
    `
}

function arena(game) {
    return html `<div class="arena">${arenaContent(game)}</div>`
}

function arenaContent(game) {
    switch (game.state) {
        case STATE_WELCOME:
            return html `<button @click="${() => store.dispatch(START_GAME)}">Start new game</button>`
        case STATE_GAME:
            return html `<button @click="${() => store.dispatch(END_TURN)}">End turn</button>`
        case STATE_GAME_OVER:
            return html `<p>Defeat!</p><button @click="${() => store.dispatch(START_GAME)}">Start new game</button>`
        case STATE_VICTORY:
            return html `<p>Victory!</p><button @click="${() => store.dispatch(START_GAME)}">Start new game</button>`
    }
}

class GameView extends ReactiveElement {
    render() {
        const game = this.state.game
        let discarded = ""
        if (this.previousGame && this.previousGame.turn !== game.turn) {
            this.classList.remove('game-animation-draw-cards')
            this.classList.remove('game-animation-discard-cards')
            void this.offsetWidth;
            this.classList.add('game-animation-draw-cards')
            this.classList.add('game-animation-discard-cards')
            discarded = cards(this.previousGame.cards.hand, "discarded")
        }
        this.animateNumber(this.previousGame, game, 'player', 'hp')
        this.animateNumber(this.previousGame, game, 'player', 'block')
        this.animateNumber(this.previousGame, game, 'enemy', 'hp')
        this.animateNumber(this.previousGame, game, 'enemy', 'block')
        this.previousGame = game
        return html `
            ${arena(game)}
            ${player(game.player)}
            ${discarded}
            ${cards(game.cards.hand)}
            ${enemy(game.enemy)}
        `
    }

    animateNumber(previousGame, game, char, property) {
        if (previousGame && previousGame[char][property] !== game[char][property]) {
            this.classList.remove(`game-animation-${char}-${property}`)
            void this.offsetWidth;
            this.classList.add(`game-animation-${char}-${property}`)
        }
    }
}
customElements.define('game-view', GameView)

class GameAnimation extends HTMLElement {
    connectedCallback() {
        const hand = [c.ATTACK, c.DEFEND, c.BLOCK, c.ATTACK, c.BLOCK]
        const tpl = player({hp: 100, block: 10, mana: 3})
        this.classList.add('game-animation-player-hp')
        render(tpl, this)
        // const cardElements = this.querySelectorAll('.card')
        // cardElements.forEach(c => c.classList.add('card-draw-animation'))
        // cardElement.insertBefore(document.createElement('div'))
    }
}
customElements.define('game-animation', GameAnimation)