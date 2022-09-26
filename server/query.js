const database = require('./database');

const Query = {
    async readAll(req, res) {
        try {
            const readAllQuery = "SELECT * FROM test";
            const { rows } = await database.query(readAllQuery);
            return res.json({ rows });
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.send(error);
        }
    }
};

module.exports = Query;