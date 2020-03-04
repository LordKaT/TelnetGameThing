class Program {
    constructor(s) {
        this.system = s;
        this.choice = 0;
        this.oldchoice = 0;
        this.x = 0;
        this.y = 0;

        this.menu = {
            0: {cmd: 'l', title: 'Login', prog: 1},
            1: {cmd: 'r', title: 'Register', prog: 2},
            2: {cmd: '1', title: 'Admin Text', prog: 3},
            3: {cmd: '2', title: 'Yoda', prog: 4}
        };

        this.system.clear(1, 1);
        this.system.title('Main Menu');
        this.system.time(true);
        this.build(10, 10);
    }

    build(px, py) {
        this.x = px;
        this.y = py;
        var temp = '\x1b[0m';
        for (var key in this.menu) {
            var k = Number(key);
            temp += '\x1b[' + (this.y + k) + ';' + this.x + 'H';
            if (k === this.choice) {  temp += '\xaf'; }
            else { temp += ' '; }
            temp += '[' + this.menu[key].cmd + ']';
            temp += ' ' + this.menu[key].title;
        }
        this.system.print(temp);
    }

    rebuild() {
        if (this.oldchoice === this.choice) { return; }

        var temp = '';
        temp += '\x1b[' + (this.y + this.oldchoice) + ';' + (this.x) + 'H ';
        temp += '\x1b[' + (this.y + this.choice) + ';' + this.x + 'H\xaf';
        temp += '[' + this.menu[this.choice].cmd + ']';
        this.system.print(temp);
    }

    input(data) {
        this.oldchoice = this.choice;
        if (data.length === 1) {
            if (data[0] === 0x0d) {
                this.system.load(this.menu[this.choice].prog);
                return;
            }
            for (var key in this.menu) {
                if (String.fromCharCode(data[0]) === this.menu[key].cmd) {
                    this.system.load(this.menu[key].prog);
                }
            }
        }
        if (data[0] === 0x1b && data[1] === 0x5b) {
            switch (data[2]) {
                case 0x41: // up
                    if (this.choice === 0) { return; }
                    this.choice--;
                    this.rebuild();
                    break;
                case 0x42: // down
                    if (this.choice >= Object.keys(this.menu).length-1) { return; }
                    this.choice++;
                    this.rebuild();
                    break;
                default:
                    console.log(data);
                    break;
            }
            return;
        }
    }
}

module.exports = Program;
