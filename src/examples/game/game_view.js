import { ReactiveElement } from '../../base/elements.js'
import { html } from '../../deps/lit-html.js'
import store from '../../base/store.js'
import gameModel from './game_model.js'
import { START_GAME, PLAY_CARD, END_TURN, STATE_WELCOME, STATE_GAME, STATE_GAME_OVER } from './game_model.js'

function characterStats(char) {
    const row = (name, val) => html `<tr><td>${name}:</td><td>${val}</td></tr>`
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
        </div>
        <div class="player-stats">
            ${characterStats(player)}
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
        </div>
        <div class="enemy-stats">
            ${characterStats(enemy)}
        </div>
        `
}

function enemyIntent(action, value) {
    if (!value) {
        return null
    }
    return html `<p>${action} ${typeof(value) === 'number' ? value : ''}</p>`
}

function cards(hand) {
    return html `
        <div class="player-hand">
            ${hand.map(card)}
        </div>
    `
}

function card(card, index) {
    const playCard = () => store.dispatch(PLAY_CARD, index)
    return html `
        <div class="card" @click="${playCard}">
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
            return html `<p>Game over</p><button @click="${() => store.dispatch(START_GAME)}">Start new game</button>`
    }
}

class GameView extends ReactiveElement {
    render() {
        const game = this.state.game
        return html `
            ${arena(game)}
            ${player(game.player)}
            ${cards(game.cards.hand)}
            ${enemy(game.enemy)}
        `
    }
}
customElements.define('game-view', GameView)