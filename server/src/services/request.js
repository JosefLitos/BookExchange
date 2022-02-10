const query = require("./sql")(process.env.MYSQL_DB)

async function create(bookId, customer) {
	if (
		!bookId ||
		!customer ||
		!customer.id ||
		(await query("SELECT * FROM book WHERE id=? AND owner_id=?;", [bookId, customer.id])).length !=
			0
	)
		return
	let res = await query("SELECT * FROM request WHERE book_id=? AND customer_id=?;", [
		bookId,
		customer.id,
	])
	if (res.length != 0) return true
	return (
		(
			await query("INSERT INTO request (book_id, customer_id) VALUES (?, ?);", [
				bookId,
				customer.id,
			])
		).affectedRows == 1
	)
}

async function remove(requestId, user) {
	if (!requestId || !user || !user.id) return
	let res = await query(
		"SELECT id FROM request WHERE id=? INNER JOIN book ON book_id=book.id WHERE owner_id=?;",
		[requestId, user.id]
	)
	if (res.length == 0) return
	return (await query("DELETE FROM request WHERE id=?;", [requestId])).affectedRows == 1
}

function removeOld() {
	return query("DELETE FROM request WHERE created_at < (NOW() - INTERVAL 1 YEAR);")
}

module.exports = {
	create,
	remove,
	removeOld,
}
