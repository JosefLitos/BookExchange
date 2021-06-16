const mysql = require("mysql")
const config = require("./sqlconfig.json")
let connection

function connect() {
	if (!connection) {
		connection = mysql.createConnection(config)
		return new Promise((resolve) =>
			connection.connect((err) => {
				if (err) connection = undefined
				resolve(err)
			})
		)
	}
}

function query(query, params) {
	return new Promise((resolve) =>
		connect().then((error) => {
			if (error) throw error
			connection.query(query, params, (err, result) => {
				if (err) throw err
				resolve(result)
			})
		})
	)
}

module.exports = { query }
