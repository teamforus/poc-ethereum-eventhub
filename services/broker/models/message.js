
export class Message {
    constructor(json) {
        this.from = json.from
        this.to = json.to
        this.data = json.data
        this.type = json.type
    }
}