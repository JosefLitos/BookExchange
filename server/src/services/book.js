const query = require("./sql")(process.env.MYSQL_DB)

function all() {
	return query("SELECT * FROM book;")
}

async function get(id) {
	return (await query("SELECT * from book WHERE id=?;", [id]))[0]
}

function add(book, user) {
	return query(
		"INSERT INTO book (owner_id, cost, name, author, year, description) VALUES (?, ?, ?, ?, ?, ?);",
		[user.id, book.cost, book.name, book.author, book.year, book.description]
	)
}

async function update(bookId, updated, user) {
	let book = await query("SELECT * FROM book WHERE id=? AND owner_id=?;", [bookId, user.id])
	if (book.length == 0) return null
	book = book[0]
	return query("UPDATE book SET cost=?, name=?, author=?, year=?, description=? WHERE id=?;", [
		updated.cost || book.cost,
		updated.name || book.name,
		updated.author || book.author,
		updated.year || book.year,
		updated.description || book.description,
		bookId,
	])
}

function remove(bookId, owner) {
	return query("DELETE FROM book WHERE id=? AND owner_id=?;", [bookId, owner.id])
}

function search(text) {
	return query("SELECT * FROM book WHERE name IN (?) OR description IN (?) OR author IN (?);", [
		text,
		text,
		text,
	])
}

async function createRequest(bookId, customer) {
	if (
		(await query("SELECT * FROM request WHERE book_id=? AND customer_id=?;", [bookId, customer.id]))
			.length > 0
	)
		return false
	return query("INSERT INTO request (book_id, customer_id) VALUES (?, ?);", [bookId, customer.id])
}

function getRequests(bookId) {
	return query("SELECT * FROM request WHERE book_id=?;", [bookId])
}

function removeRequest(requestId) {
	return query("DELETE FROM request WHERE id=?;", [requestId]).then(res=>res.affectedRows == 1)
}

function removeOldRequests(timestamp) {
	return query("DELETE FROM request WHERE created_at < (NOW() - INTERVAL 1 YEAR);")
}

module.exports = {
	all,
	get,
	add,
	update,
	remove,
	search,
	createRequest,
	getRequests,
	removeRequest,
	removeOldRequests,
}
