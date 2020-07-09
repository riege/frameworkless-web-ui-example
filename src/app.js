console.log("Hello, airhacks")

class AirHacks {

    constructor(name) {
        this.message = `ask questions, ${name}!`
    }

    getMessage() {
        return this.message
    }

    get content() {
        return "-> " + this.message
    }

    static create() {
        return "string created!"
    }
}

const airhacks = new AirHacks('test')
console.log(airhacks.content)