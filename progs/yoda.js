class Program {
    constructor(s) {
        this.system = s;
        this.fs = require('fs');
        this.system.time(false);
        this.system.clear(1, 1);
        this.system.print(this.fs.readFileSync('./files/art/yoda.ans'));
        this.system.print('\x1b[25;61H\x1b[1;45m[ESC]\x1b[0m for Main Menu');
    }

    input(data) {
        if (data.length === 1 && data[0] === 0x1b) {
            this.system.load(0);
        }
        return;
    }
}

module.exports = Program;
