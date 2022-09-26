const database = require('./database');

async function query(req, res, query_string) {
    try {
        const { rows } = await database.query(query_string);
        return res.json({ rows });
    } catch (error) {
        console.log(`Error: ${error}`);
        return res.send(error);
    }
}

const Query = {
    async readAll(req, res) {
        await query(req, res, "SELECT * FROM test");    
    },
    async columns(req, res) {
        await query(req, res, "SELECT * FROM information_schema.columns WHERE table_name='test' AND table_catalog='cs348'");
    },
    async add(req, res, text) {
        await query(req, res, `INSERT INTO test (content) VALUES ('${text}')`);
    },
    async deleteAll(req, res) {
        console.log("goodbye cruel world");
        await query(req, res, "DELETE FROM test");
    }
};

module.exports = Query;