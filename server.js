let net = require('net');
let Database = require('./database.js');
let System = require('./system.js');

var systems = [];
var freeID = [];
var db = new Database();

function main(socket) {
    console.log(socket.address());
    socket.systemID = systems.length;
    if (freeID.length > 0) {
        socket.systemID = freeID.pop();
        systems[socket.systemID] = new System(socket, db);
    } else {
        systems.push(new System(socket, db));
    }

    socket.on('data', (data) => {
        systems[socket.systemID].input(data);
    });
    
    socket.on('end', () => {
        if (systems[socket.systemID] !== null) {
            systems[socket.systemID].close();
            systems[socket.systemID] = null;
            freeID.push(socket.systemID);
        }
    });

    socket.on('error', (err) => {
        if (systems[socket.systemID] !== null) {
            systems[socket.systemID].close();
            systems[socket.systemID] = null;
            freeID.push(socket.systemID);
        }
    });
}

var server = net.createServer(main);
server.listen(8023);
