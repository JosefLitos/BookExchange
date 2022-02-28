const query = require("./sql")(process.env.MYSQL_DB)

class Book {
	id
	name
	author
	year
	cost
	description
}

/**
 * @param {{id, email}} user data of querrier
 * @param {String} q search query
 *
 * @returns {Book[]} all books except owned ones
 */
function all(user, q) {
	if (!q)
		return user
			? query("SELECT * FROM book WHERE owner_id!=? ORDER BY cost;", [user.id], true)
			: query("SELECT * FROM book ORDER BY cost;", null, true)

	console.log(`Searching for: '${q}'`)
	if (!user) return query("SELECT * FROM book WHERE name LIKE ? ORDER BY cost;", [`%${q}%`], true)
	return query(
		"SELECT * FROM book WHERE name LIKE ? AND owner_id!=? ORDER BY cost;",
		[`%${q}%`, user.id],
		true
	)
}

/**
 * @returns {Book} requested book
 */
async function get(id) {
	return (await query("SELECT * from book WHERE id=?;", [id], true))[0]
}

/**
 * @returns object with affectedRows value if successful
 */
async function create(book, user) {
	let res = await query(
		"INSERT INTO book (owner_id, name, author, year, cost, description) VALUES (?, ?, ?, ?, ?, ?);",
		[user.id, book.name, book.author, book.year, book.cost, book.description || null],
		true
	)
	book.id = res.insertId
	return res
}

/**
 * @returns object with affectedRows value if successful
 */
async function update(bookId, updated, user) {
	let book = await query("SELECT * FROM book WHERE id=? AND owner_id=?;", [bookId, user.id], true)
	if (book.length == 0) return
	book = book[0]
	let toAdd = ["", []]
	if (updated.name != book.name) {
		toAdd[0] += ", name=?"
		toAdd[1].push(updated.name)
	}
	if (updated.cost != book.cost) {
		toAdd[0] += ", cost=?"
		toAdd[1].push(updated.cost)
	}
	if (updated.author != book.author) {
		toAdd[0] += ", author=?"
		toAdd[1].push(updated.author)
	}
	if (updated.year != book.year) {
		toAdd[0] += ", year=?"
		toAdd[1].push(updated.year)
	}
	if (
		updated.description != book.description &&
		!(!updated.description == true && !book.description == true)
	) {
		toAdd[0] += ", description=?"
		toAdd[1].push(updated.description || null)
	}
	if (toAdd[1].length == 0) return false
	toAdd[0] = toAdd[0].substring(1)
	toAdd[0] = "UPDATE book SET" + toAdd[0] + " WHERE id=?;"
	return await query(toAdd[0], [...toAdd[1], bookId])
}

/**
 * @returns object with affectedRows value if successful
 */
function remove(bookId, owner) {
	if (owner && owner.id && owner.name && owner.icon) {
		return query("DELETE FROM book WHERE id=? AND owner_id=?;", [bookId, owner.id])
	}
}

class RequestsWithEmail {
	id
	customer_id
	book_id
	// Customer's email
	email
}

/**
 * @returns {RequestsWithEmail[]} requests for a given book
 */
function requestsWithEmail(bookId) {
	return bookId
		? query(
				"SELECT request.*, user.email FROM request INNER JOIN user ON customer_id=user.id WHERE book_id=?;",
				[bookId],
				true
		  )
		: []
}

module.exports = { all, get, create, update, remove, requestsWithEmail, Book, RequestsWithEmail }
