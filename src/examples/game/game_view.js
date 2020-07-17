import { ReactiveElement2 } from '../../base/elements.js'
import { html } from '../../deps/lit-html.js'
import { STATE_VICTORY } from './game_model.js'
import { startGame, playCard, endTurn, STATE_WELCOME, STATE_GAME, STATE_GAME_OVER } from './game_model.js'

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

function showOutOfManaMessage(event) {
    const element = document.createElement('game-oom-message')
    element.style.position = 'fixed'
    element.style.top = `${event.clientY - 50}px`
    element.style.left = `${event.clientX - element.clientWidth}px`
    document.body.appendChild(element)
}

class OutOfManaMessage extends HTMLElement {
    connectedCallback() {
        setTimeout(() => this.remove(), 1000)
        this.innerHTML = `
            <div class="game-oom-message"">
                <h2>Out of Mana</h2>
                <p>End turn to gain mana</p>
            </div>`
        this.style.animation = 'fade-out-up 1s ease-out forwards'
        this.style.color = "#000"
        this.style.textShadow = "-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff"
    }
}
customElements.define('game-oom-message', OutOfManaMessage)

class GameView extends ReactiveElement2 {
    render() {
        const game = this.state
        let discarded = ""
        if (this.previousGame && this.previousGame.turn !== game.turn) {
            this.classList.remove('game-animation-draw-cards')
            this.classList.remove('game-animation-discard-cards')
            void this.offsetWidth;
            this.classList.add('game-animation-draw-cards')
            this.classList.add('game-animation-discard-cards')
            discarded = this.cards(this.previousGame.cards.hand, "discarded")
        }
        this.animateNumber(this.previousGame, game, 'player', 'hp')
        this.animateNumber(this.previousGame, game, 'player', 'block')
        this.animateNumber(this.previousGame, game, 'enemy', 'hp')
        this.animateNumber(this.previousGame, game, 'enemy', 'block')
        console.log(game, this.previousGame);
        
        this.previousGame = game
        return html `
            ${this.arena(game)}
            ${player(game.player)}
            ${discarded}
            ${game.state === STATE_GAME ? this.cards(game.cards.hand, null, game.player.mana) : ""}
            ${enemy(game.enemy)}
        `
    }

cards(hand, cssClass, mana) {
    return html `
        <div class="player-hand ${cssClass}">
            ${hand.map((card, i) => this.card(mana, card, i))}
        </div>
    `
}

 card(mana, card, index) {
    const handler = mana > 0
                   ? this.dispatch(playCard, index)
                   : showOutOfManaMessage
    return html `
        <div class="card card-${index} card-${card.name}" @click="${handler}">
            <h1>${card.name}</h1>
            <p>
                ${card.description}
            </p>
        </div>
    `
}

 arena(game) {
    return html `<div class="arena">${this.arenaContent(game)}</div>`
}

 arenaContent(game) {
    switch (game.state) {
        case STATE_WELCOME:
            return html `<h2>Welcome to the game</h2><button @click="${this.dispatch(startGame)}">Start new game</button>`
        case STATE_GAME:
            return html `<button @click="${this.dispatch(endTurn)}">End turn</button>`
        case STATE_GAME_OVER:
            return html `<h2>Defeat!</h2><button @click="${this.dispatch(startGame)}">Try again</button>`
        case STATE_VICTORY:
            return html `<h2>Victory!</h2><button @click="${this.dispatch(startGame)}">Start new game</button>`
    }
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
        this.appendChild(new OutOfManaMessage())
    }
}
customElements.define('game-animation', GameAnimation)