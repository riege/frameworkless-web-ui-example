import { ReactiveElement } from '../../base/elements.js'
import { html } from '../../deps/lit-html.js'

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
        <div class="player-model"></div>
        <div class="player-stats">
            ${characterStats(player)}
        </div>
        `
}

function enemy(enemy) {
    return html `
        <div class="enemy-model"></div>
        <div class="enemy-stats">
            ${characterStats(enemy)}
        </div>
        `
}

function cards(hand) {
    return html `
        <div class="player-hand">
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
        </div>
    `
}

class GameView extends ReactiveElement {
    render() {
        const game = this.state.game
        return html `
            ${player(game.player)}
            ${cards(game.player.hand)}
            ${enemy(game.enemy)}
        `
    }
}
customElements.define('game-view', GameView)