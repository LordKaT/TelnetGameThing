class Program {
    constructor(s) {
        this.system = s;
        this.inputmode = 'username';
        this.inputtext = '';
        this.posx = 5;
        this.posy = 3;
        this.username = '';
        this.password = '';
        this.system.title('New User Registration');
        this.system.clear();
        this.system.print('\x1b[' + this.posy.toString() + ';' + this.posx.toString() + 'HUsername: \x1b[' + (this.posy + 1).toString() + ';' + (this.posx).toString() + 'HPassword: ');
        this.system.print('\x1b[25;61H\x1b[1;45m[ESC]\x1b[0m for Main Menu');
    }

    input(data) {
        if (data.length === 1) {
            if (this.inputmode === 'wait') {
                return;
            }
            if (this.inputmode === 'error') {
                this.system.load(2);
                return;
            }
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
                        this.inputmode = 'confirm';
                        this.posy = 5;
                        this.system.print('\x1b[7;5HIs this correct? [y/n]');
                    }
                    break;
                default:
                    if (this.inputmode !== 'confirm') {
                        this.inputtext += String.fromCharCode(data[0]);
                        this.system.print('\x1b[' + this.posy.toString() + ';' + (this.inputtext.length + 14).toString() + 'H' + String.fromCharCode(data[0]));
                    } else {
                        if (String.fromCharCode(data[0]) === 'y') {
                            this.inputmode = 'wait';
                            this.system.db.getAccount(this.username, (error, rows) => {
                                console.log('accounts: ' + rows.length);
                                console.log('account: ' + rows);
                                this.system.print('\x1b[8;5HAccounts: ' + rows.length.toString());
                                if (rows.length === 0) {
                                    this.regError();
                                    /*
                                    this.system.db.addAccount(this.username, this.password, '0.0.0.0', 'active', (error, rows) => {
                                        if (error) {
                                            this.regError();
                                        }
                                    });
                                    */
                                } else {
                                    this.regError();
                                }
                            });
                        }
                        if (String.fromCharCode(data[0]) === 'n') {
                            this.system.load(2);
                        }
                    }
                    break;
            }
        }
    }

    regError() {
        this.system.clear();
        this.system.print('\x1b[2;1HError registering. Press any key to continue.');
        this.inputmode = 'error';
    }
}

module.exports = Program;
