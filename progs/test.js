class Program {
    constructor(s) {
        this.system = s;
        this.oldx = 10;
        this.oldy = 10;
        this.posx = 10;
        this.posy = 10;
        this.input = '';

        this.system.title('\x1b[31mRed Dragon Inn\x1b[0m');
        this.system.clear();
        this.system.print('\x1b[2;24r');
        this.system.print('\x1b[24;1HYou enter the Red Dragon Inn.');
        this.system.print('\x1b[25;1H> ');
        //system.print('\x1b[25;61H\x1b[1;45m[ESC]\x1b[0m for Main Menu');
        //draw();
    }

    draw() {
            system.print('\x1b[' + this.oldx + ';' + this.oldy + 'H \x1b[' + this.posx + ';' + this.posy + 'H\x02');
    }

    input(data) {
        if (data.length === 1) {
            switch (data[0]) {
                case 0x1b: // escape
                this.system.load(0);
                    break;
                case 0x08: // backspace
                    if (this.input.length > 0) {
                        this.system.print('\x1b[25;' + (this.input.length + 2).toString() + 'H \x1b[25;' + (this.input.length).toString() + 'H');
                        this.input = this.input.slice(0, -1);
                    }
                    break;
                case 0x09: // tab
                    break;
                case 0x0d: // enter/return
                /*
                    system.print('\x1b[24;' + (input.length +2).toString() + 'H\n' + input + '\n');
                    input = '';
                    system.print('\x1b[25;1H>');
                */
                    this.system.print('\x1b[25;3H\x1b[0J');
                    this.system.print('\x1b[24;1H\n<yourname> ' + this.input);
                    this.system.print('\x1b[25;1H\x1b[0J> ');
                    this.input = '';
                    break;
                default:
                    this.input += String.fromCharCode(data[0]);
                    this.system.print('\x1b[25;' +  (this.input.length + 2).toString() + 'H' + String.fromCharCode(data[0]));
                    break;
            }
        }
        /*
        if (data[0] >= 0x31 && data[0] <= 0x39) {
            oldx = posx;
            oldy = posy;
            switch (data[0]) {
                case 0x32:
                    posx++;
                    break
                case 0x34:
                    posy--;
                    break;
                case 0x36:
                    posy++;
                    break;
                case 0x38:
                    posx--;
                    break;
            }
            screenx = posx;
            screeny = posy;
            draw();
        } else {
            console.log(data);
        }
        */
        return;
    }
}

module.exports = Program;
