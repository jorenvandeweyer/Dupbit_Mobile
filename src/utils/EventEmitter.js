export default class EventEmitter {
    constructor () {
        this.listeners = new Map();
    }

    emit (type, message) {
        if (this.listeners.has(type)) {
            this.listeners.get(type)(message);
        }
    }

    on (type, fn) {
        this.listeners.set(type, fn);
    }
}
