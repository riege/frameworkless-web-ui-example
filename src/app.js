console.log("Hello, airhacks")

const button = document.querySelector('button')
const output = document.querySelector('output')
const input = document.querySelector('input')

button.onclick = e => output.innerHTML = 'button clicked'
console.dir(button)

input.onkeyup = e => output.innerHTML = `<h2>${e.target.value}</h2>`
