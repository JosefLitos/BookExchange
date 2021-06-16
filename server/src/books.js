const query = require('./sql').query

function all() {
	return query('SELECT * FROM book;')
}

async function get(id) {
	return (await query('SELECT * from book WHERE id=?;', [id]))[0]
}

function add(ownerId, cost, name, author, year, description) {
	return query(
		'INSERT INTO book (user_id, cost, name, author, year, description) VALUES (?, ?, ?, ?, ?, ?);',
		[ownerId, cost, name, author, year, description]
	)
}

async function update(bookId, ownerId, cost, name, author, year, description) {
	let book = await query('SELECT * FROM book WHERE id=? AND user_id=?;', [bookId, ownerId])
	if (book.length == 0) return
	return query('UPDATE book SET cost=?, name=?, author=?, year=?, description=? WHERE id=?;', [
		cost || book[0].cost,
		name || book[0].name,
		author || book[0].author,
		year || book[0].year,
		description || book[0].description,
		book_id,
	])
}

function remove(bookId) {
	return query('DELETE FROM book WHERE id=?;', [bookId])
}

function search(text) {
	return query('SELECT * FROM book WHERE name IN (?) OR description IN (?) OR author IN (?)', [
		text,
		text,
		text,
	])
}

async function request(bookId, customerId) {
	if (
		(await query('SELECT * FROM request WHERE book_id=? AND customer_id=?', [bookId, customerId]))
			.length > 0
	)
		return false
	return query('INSERT INTO request (book_id, customer_id) VALUES (?, ?)', [bookId, customerId])
}

function abortRequest(requestId) {
	return query('DELETE FROM request WHERE id=?;', [requestId])
}

function removeOldRequests(timestamp) {
	return query('DELETE FROM request WHERE created_at < (NOW() - INTERVAL 1 YEAR);')
}

module.exports = { all, get, add, update, remove, search, request, abortRequest, removeOldRequests }
