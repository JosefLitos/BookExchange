const sql = require("mariadb")

// SOURCE: - https://www.npmjs.com/package/mariadb

module.exports = function create(dbName) {
	let pool = sql.createPool({
		port: process.env.MYSQL_PORT,
		server: process.env.MYSQL_HOST,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		database: dbName,
		connectionLimit: 5,
	})
	return (query, params, nodebug) =>
		new Promise(async (resolve, reject) => {
			let conn
			try {
				conn = await pool.getConnection()
				const res = await conn.query(query, params)
				if (res.meta) delete res.meta
				if (!nodebug) console.log("\x1b[32mSQL:\x1b[0m", query, "\n\x1b[32mresponse:\x1b[0m", res)
				resolve(res)
			} catch (err) {
				console.error("\x1b[31mSQL Error occured:", err)
				reject(err)
			} finally {
				if (conn) conn.release()
			}
		})
}
