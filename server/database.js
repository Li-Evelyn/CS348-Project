const { Pool } = require("pg");
DATABASE_URL = `cs348://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5432/cs348`;

const pool = new Pool({
    connectionString: DATABASE_URL
});

function query(text) {
    return new Promise((resolve, reject) => {
        pool
            .query(text)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = {
    query
};
