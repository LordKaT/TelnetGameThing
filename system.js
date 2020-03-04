var Modem = require('./modem.js');

var programs = {
    0: './menus/menu_main.js',
    1: './progs/login.js',
    2: './progs/register.js',
    3: './progs/test.js',
    4: './progs/yoda.js'
};

class System {
    constructor(s, d) {
        this.modem = new Modem(s, 2);
        this.titleText = 'Jasons Test Telnet Server';
        this.interval = null;
        this.systemTime = null;
        this.socket = null;
        this.drawtime = true;
        this.username = null;
        this.db = null;
        this.prog = null;

        if (this.interval !== null) {
            clearInterval(this.interval);
        }

        this.socket = s;
        this.db = d;
        // hide cursor
        this.modem.write('\x1b[?25l');
        this.load(0);
        this.interval = setInterval(this.loop.bind(this), 100);
    }
    
    close() {
        this.modem.close();
    }

    print(text) {
        this.modem.write(text);
    }

    clear(x=0, y=0) {
        var clearstr = '';
        if (x <= 0 && y <= 0) {
            clearstr = '\x1b[2;1H';
        } else {
            clearstr = '\x1b[' + x + ';' + y + 'H';
        }
        this.modem.write(clearstr + '\x1b[40m\x1b[0J\x1b[H\x1b[0m');
    }

    title(t) {
        if (t === null) { t = this.titleText; }
        var temp = '\x1b[1;1H\x1b[0m\x1b[32m\xae';
        temp += '\x1b[35m' + t + '\x1b[32m\xaf\x1b[0m';
        if (t.length < this.titleText.length) { 
            temp += ' '.repeat(this.titleText.length - t.length);
        }
        this.modem.write(temp);
        this.titleText = t;
        return this.titleText;
    }

    time(dt=null) {
        if (dt !== null) {
            this.drawtime = dt;
            if (this.drawtime === false) {
                this.modem.write('\x1b[0m\x1b[1;66H' + ' '.repeat(20));
                return;
            }
        }

        var modemString = new String();
        if (this.systemTime === null || dt === true) {
            this.systemTime = new Date();
            modemString += '\x1b[0m';
            modemString += '\x1b[1;66H' + ('0' + (this.systemTime.getMonth()+1).toString()).slice(-2) + '/' + ('0' + this.systemTime.getDate().toString()).slice(-2) + '/' +  (this.systemTime.getFullYear().toString()).slice(-2);
            modemString += '\x1b[1;75H' + ('0' + this.systemTime.getHours().toString()).slice(-2) + ':' + ('0' + this.systemTime.getMinutes().toString()).slice(-2);// + ':' + ('0' + this.systemTime.getSeconds().toString()).slice(-2);
            this.modem.write(modemString);
            return;
        }

        var tempTime = new Date();
        if (tempTime.getMonth() === this.systemTime.getMonth() &&
            tempTime.getDate() === this.systemTime.getDate() &&
            tempTime.getFullYear() === this.systemTime.getFullYear() &&
            tempTime.getHours() === this.systemTime.getHours() &&
            tempTime.getMinutes() === this.systemTime.getMinutes()) {
                return;
        }

        var xpos = 0;
        if (tempTime.getMonth() !== this.systemTime.getMonth()) {
            modemString = ('0' + (tempTime.getMonth()+1).toString()).slice(-2);
            xpos = 66;
        }
        if (tempTime.getDate() !== this.systemTime.getDate()) {
            if (xpos === 0) { xpos = 69; }
            else { modemString += '/'; }
            modemString += ('0' + tempTime.getDate().toString()).slice(-2);
        }
        if (tempTime.getFullYear() !== this.systemTime.getFullYear()) {
            if (xpos == 0) { xpos = 72; }
            else { modemString += '/'; }
            modemString += (tempTime.getFullYear().toString()).slice(-2);
        }
        if (modemString.length > 0) {
            this.modem.write('\x1b[0m\x1b[1;' + xpos.toString() + 'H' + modemString);
            modemString = '';
            xpos = 0;
        }
    
        if (tempTime.getHours() !== this.systemTime.getHours()) {
            modemString = ('0' + tempTime.getHours().toString()).slice(-2);
            xpos = 75;
        }

        if (tempTime.getMinutes() !== this.systemTime.getMinutes()) {
            if (xpos === 0) { xpos = 78; }
            else { modemString += ':'; }
            modemString += ('0' + tempTime.getMinutes().toString()).slice(-2);
        }
        if (modemString.length > 0) {
            this.modem.write('\x1b[0m\x1b[1;' + xpos.toString() + 'H' + modemString);
        }
        this.systemTime = new Date();
    }

    loop() {
        if (this.drawtime === true) {
            this.time();
        }
    }

    input(data) {
        this.prog.input(data);
    }

    load(p) {
        var Program = require(programs[p]);
        this.prog = new Program(this);
    }
}

module.exports = System;
