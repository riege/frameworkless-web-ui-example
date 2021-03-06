import { ReactiveElement } from '../../base/elements.js'
import { html } from '../../deps/lit-html.js'
import { STATE_VICTORY } from './game_model.js'
import { startGame, playCard, endTurn, STATE_WELCOME, STATE_GAME, STATE_GAME_OVER } from './game_model.js'
import { calculateAnimationClasses, showOutOfManaMessage } from './animations.js'

function characterStats(char) {
    const row = (name, val) => val !== undefined ? html `<tr class="${name}"><td>${name}:</td><td>${val}</td></tr>` : null
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
    return html `<p class="enemy-intent-${action}">${action} ${value}</p>`
}

class GameView extends ReactiveElement {

    render() {
        this.resetAnimations()

        const game = this.state


        let discarded
        if (this.previousGame && game.turn !== this.previousGame.turn) {
            discarded = this.cards(this.previousGame.cards.hand, "discarded")
        }

        this.previousGame = this.state
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
        const handler = mana > 0 ? this.dispatch(playCard, index) : showOutOfManaMessage
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

    resetAnimations() {
        const animationClasses = calculateAnimationClasses(this.previousGame, this.state)
        animationClasses.forEach(c => this.classList.remove(c))
        void this.offsetWidth
        animationClasses.forEach(c => this.classList.add(c))
    }
}
customElements.define('game-view', GameView)
