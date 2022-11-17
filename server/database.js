const { Pool } = require("pg");
DATABASE_URL = `cs348://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5432/cs348`;

const pool = new Pool({
    connectionString: DATABASE_URL
});

module.exports = {
	query: (text, params) => {
		return pool.query(text, params);
	},
};
