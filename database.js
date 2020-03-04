let sql = require('sqlite3');

class Database {
    constructor() {
        this.db = new sql.Database('files/main.db', (e) => {
            if (e) {
                return console.error(e.message);
            }
            console.log('SQL Connected.');
        });
    }

    getAccount(name, callback) {
        this.db.all('SELECT * FROM accounts WHERE name="' + name + '"', [], callback);
    }
    
    addAccount(name, pass, ip, status) {

    }
}

module.exports = Database;
