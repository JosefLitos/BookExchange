const sql = require("mariadb")

// SOURCE: - https://www.npmjs.com/package/mariadb

function create(dbName) {
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
				if (res.meta) res.meta = undefined
				if (!nodebug) console.log("SQL:", query, "\nresponse:", res)
				resolve(res)
			} catch (err) {
				console.log("SQL Error occured!")
				reject(err)
			} finally {
				if (conn) conn.release()
			}
		})
}

module.exports = create
