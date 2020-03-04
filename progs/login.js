class Program {
    constructor(s) {
        this.system = s;
        this.inputmode = 'username';
        this.inputtext = '';
        this.posx = 5;
        this.posy = 3;
        this.username = '';
        this.password = '';
        this.system.title('Login');
        this.system.clear();
        this.system.print('\x1b[' + this.posy.toString() + ';' + this.posx.toString() + 'HUsername: \x1b[' + (this.posy + 1).toString() + ';' + (this.posx).toString() + 'HPassword: ');
        this.system.print('\x1b[25;61H\x1b[1;45m[ESC]\x1b[0m for Main Menu');
    }

    input(data) {
        if (data.length === 1) {
            switch (data[0]) {
                case 0x1b: // escape
                    this.system.load(0);
                    break;
                case 0x08: // backspace
                    if (this.inputtext.length > 0) {
                        this.system.print('\x1b[' + this.posy.toString() + ';' + (this.inputtext.length + 14).toString() + 'H \x1b[3;' + (this.inputtext.length).toString() +'H');
                        this.inputtext = this.inputtext.slice(0, -1);
                    }
                    break;
                case 0x09: // tab
                    break;
                case 0x0d: // eneter/return
                    if (this.inputtext.length === 0) { return; }
                    if (this.inputmode === 'username') {
                        this.username = this.inputtext;
                        this.inputtext = '';
                        this.inputmode = 'password';
                        this.posy = 4;
                    } else if (this.inputmode === 'password') {
                        this.password = this.inputtext;
                        this.inputmode = 'login';
                        // do the login thing
                    }
                    break;
                default:
                    break;
            }
        }
    }
}

module.exports = Program;
