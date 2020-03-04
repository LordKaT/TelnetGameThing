var utils = require('./utils.js');

var speeds = {
    0: {text: '300bps', ms: 26, cpc: 1},
    1: {text: '1200bps', ms: 13, cpc: 1},
    2: {text: '2400bps', ms: 7, cpc: 1},
    3: {text: '4800bps', ms: 4, cpc: 1},
    4: {text: '9600bps', ms: 2, cpc: 1},
    5: {text: '14.4kbps', ms: 1, cpc: 1},
    6: {text: '28.8kbps', ms: 1, cpc: 2},
    7: {text: '56.6kbps', ms: 1, cpc: 4},
    999: { text: 'INF', ms: 1}
};

class Modem {
    constructor(sock, speed=5) {
        this.bufferArray = [];
        this.socket = sock;
        this.speed = speed;
        setTimeout(this.loop.bind(this), speeds[this.speed].ms);
    }

    clear() {
        this.bufferArray = [];
    }

    close() {
        this.clear();
        if (this.socket !== null) {
            this.socket.end();
        }
    }

    speed(speed) {
        this.speed = speed;
    }

    writeSocket(buffer) {
        if (this.speed === 999) {
            this.socket.write(buffer);
            return new Buffer.alloc(0);
        } else {
            var b = Buffer.alloc(1);
            buffer.copy(b, 0, 0, 1);
            buffer = buffer.slice(1);
            this.socket.write(b);
            return buffer;
        }
    }

    writeBuffer(buffer) {
        if (buffer === undefined && !(buffer instanceof Buffer) && !(buffer instanceof String)) {
            return;
        }
        if (typeof buffer === 'string' || buffer instanceof String) {
            this.bufferArray.push(Buffer.from(utils.ucs2decode(buffer)));
        } else {
            this.bufferArray.push(Buffer.from(buffer));
        }
        return;
    }

    write(buffer) {
        this.writeBuffer(buffer);
        return;
    }

    loop() {
        if (this.bufferArray.length > 0) {
            this.bufferArray[0] = this.writeSocket(this.bufferArray[0]);
            if (this.bufferArray[0].length === 0) {
                this.bufferArray.splice(0, 1);
            }
            if (this.bufferArray.length === 0) {
                this.socket.write('\x1b[25;80H', true);
            }
        }
        setTimeout(this.loop.bind(this), speeds[this.speed].ms);
    }
}

module.exports = Modem;
