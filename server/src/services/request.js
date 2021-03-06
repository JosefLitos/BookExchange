const query = require("./sql")(process.env.MYSQL_DB)

/**
 * @returns {boolean} true if successful
 */
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
			await query(
				"INSERT INTO request (book_id, customer_id) VALUES (?, ?);",
				[bookId, customer.id],
				true
			)
		).affectedRows == 1
	)
}

/**
 * @param user owner of the book concerned in the request
 * @returns {{book_id;customer_id}} data of removed request
 */
async function remove(requestId, user) {
	if (requestId && user && user.id) {
		let request = (
			await query(
				"SELECT customer_id, book_id FROM request INNER JOIN book ON book_id=book.id WHERE owner_id=? AND request.id=?;",
				[user.id, requestId],
				true
			)
		)[0]
		if (
			request &&
			(await query("DELETE FROM request WHERE id=?;", [requestId], true)).affectedRows == 1
		)
			return request
	}
}

/**
 * Aborts the request made by `user`.
 * @returns object with affectedRows value if successful
 */
async function abort(requestId, user) {
	if (requestId && user && user.id) {
		let request = (
			await query("SELECT * FROM request WHERE customer_id=? AND id=?;", [user.id, requestId], true)
		)[0]
		if (
			request &&
			(await query("DELETE FROM request WHERE id=?;", [requestId], true)).affectedRows == 1
		)
			return request
	}
}

/**
 * The `user` owning the book requested accepts the request.
 * @returns object with affectedRows value if successful
 */
async function accept(requestId, user) {
	if (requestId && user && user.id) {
		let book = (
			await query(
				"SELECT customer_id, book.* FROM request INNER JOIN book ON book_id=book.id WHERE owner_id=? AND request.id=?;",
				[user.id, requestId],
				true
			)
		)[0]
		if (
			book &&
			(await query("UPDATE request SET accepted=1 WHERE id=?;", [requestId], true)).affectedRows ==
				1
		)
			return book
	}
}

function removeOld() {
	return query("DELETE FROM request WHERE created_at < (NOW() - INTERVAL 1 YEAR);")
}

/**
 * @returns {{id;book_id;name;accepted;created_at}[]} all requests made by `user`
 */
async function fromUser(user) {
	if (user && user.id)
		return await query(
			"SELECT book_id, request.id, created_at, name, accepted FROM request INNER JOIN book ON book_id=book.id WHERE customer_id=?;",
			[user.id],
			true
		)
}

/**
 * @returns {{id;book_id;name;accepted;created_at}[]} all requests waiting for acceptation by `user`
 */
async function forUser(user) {
	if (user && user.id)
		return await query(
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
