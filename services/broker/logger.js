
self.addEventListener('message', (message) => {
    console.log(message.data)
    self.postMessage(Logger.success)
})

export class Logger {
    static get success() { 'success' }
    static get failure() { 'failure' }
}