import { STATE_GAME } from './game_model.js'

export function calculateAnimationClasses(previousState, currentState) {
    const result = []
    if (previousState && previousState.turn !== currentState.turn) {
        result.push('game-animation-draw-cards')
        if (previousState.state === STATE_GAME) {
            result.push('game-animation-discard-cards')
        }
    }
    animateNumberClass(result, previousState, currentState, 'player', 'hp')
    animateNumberClass(result, previousState, currentState, 'player', 'block')
    animateNumberClass(result, previousState, currentState, 'enemy', 'hp')
    animateNumberClass(result, previousState, currentState, 'enemy', 'block')
    return result
}

function animateNumberClass(resultList, previousState, currentState, char, property) {
    if (previousState && previousState[char][property] !== currentState[char][property]) {
        resultList.push(`game-animation-${char}-${property}`)
    }
}

export function showOutOfManaMessage(event) {
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
