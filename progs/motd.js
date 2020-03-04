var fs = require('fs');
var system = null;

exports.init = init;
exports.input = input;

function init(s, b, t) {
    system = s;
    var motd = fs.readFileSync('./files/motd.txt');
    system.print('\x1b[2;1H\x1b[0J');
    system.print(motd);
    system.print('\x1b[25;61H\x1b[1;45m[ESC]\x1b[0m for Main Menu');
}

function input(data) {
    if (data.length === 1 && data[0] === 0x1b) {
        system.load(0);
    }
    return;
}
