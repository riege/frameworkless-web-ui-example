/* global console */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function submitOrderTask() {
    const waitTime = Math.random() * 2000 + 500
    console.log("Contacting the order server ...");
    await sleep(waitTime)
    if (Math.random() < 0.6) {
        console.log("Order server unreachable");
        throw new Error('order service unreachable')
    }
    console.log("Order submitted to server");
}
