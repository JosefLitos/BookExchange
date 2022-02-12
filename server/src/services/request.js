const query = require("./sql")(process.env.MYSQL_DB)

async function create(bookId, customer) {
	if (
		!bookId ||
		!customer ||
		!customer.id ||
		(await query("SELECT * FROM book WHERE id=? AND owner_id=?;", [bookId, customer.id], true))
			.length != 0
	)
		return
	let res = await query(
		"SELECT * FROM request WHERE book_id=? AND customer_id=?;",
		[bookId, customer.id],
		true
	)
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
	if (
		requestId &&
		user &&
		user.id &&
		(
			await query(
				"SELECT request.id FROM request INNER JOIN book ON book_id=book.id WHERE owner_id=? AND request.id=?;",
				[user.id, requestId],
				true
			)
		).length != 0
	)
		return (await query("DELETE FROM request WHERE id=?;", [requestId])).affectedRows == 1
}

async function abort(requestId, user) {
	if (
		requestId &&
		user &&
		user.id &&
		(
			await query(
				"SELECT id FROM request WHERE customer_id=? AND id=?;",
				[user.id, requestId],
				true
			)
		).length != 0
	)
		return (await query("DELETE FROM request WHERE id=?;", [requestId])).affectedRows == 1
}

async function accept(requestId, user) {
	if (
		requestId &&
		user &&
		user.id &&
		(
			await query(
				"SELECT request.id FROM request INNER JOIN book ON book_id=book.id WHERE owner_id=? AND request.id=?;",
				[user.id, requestId],
				true
			)
		).length != 0
	)
		return (await query("UPDATE request SET accepted=1 WHERE id=?;", [requestId])).affectedRows == 1
}

function removeOld() {
	return query("DELETE FROM request WHERE created_at < (NOW() - INTERVAL 1 YEAR);")
}

function fromUser(user) {
	if (user && user.id)
		return query(
			"SELECT book_id, request.id, created_at, name, accepted FROM request INNER JOIN book ON book_id=book.id WHERE customer_id=?;",
			[user.id],
			true
		)
}

function forUser(user) {
	if (user && user.id)
		return query(
			"SELECT book_id, request.id, created_at, name, accepted FROM book INNER JOIN request ON book.id=book_id WHERE owner_id=? ORDER BY book_id, id;",
			[user.id],
			true
		)
}

module.exports = {
	create,
	remove,
	abort,
	accept,
	removeOld,
	fromUser,
	forUser,
}
