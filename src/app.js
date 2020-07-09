
const airhacks = (a, b, c) => { return "cached content " + a + b + c}
const nice = 'muli'

const message = airhacks`
<h1>${nice}</h1>
`

console.log(message)