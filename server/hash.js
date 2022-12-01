const shajs = require('sha.js');
const salt = process.env.SALT;

function hashPassword(password) {
	return shajs('sha256').update(`${password}${salt}`).digest('hex');
}

module.exports = {
	hashPassword,
}