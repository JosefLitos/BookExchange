const query = require("./sql")(process.env.MYSQL_DB)
const fs = require("fs")
const path = require("./path")

function all(user, q) {
	if (!user) return query("SELECT * FROM book ORDER BY cost ASC;", null, true)
	if (!q) return query("SELECT * FROM book WHERE owner_id!=? ORDER BY cost ASC;", [user.id], true)

	console.log(`Searching for: '${q}'`)
	if (!user)
		return query("SELECT * FROM book WHERE name LIKE ? ORDER BY cost ASC;", [`%${q}%`], true)
	return query(
		"SELECT * FROM book WHERE name LIKE ? AND owner_id!=? ORDER BY cost ASC;",
		[`%${q}%`, user.id],
		true
	)
}

async function get(id) {
	return (await query("SELECT * from book WHERE id=?;", [id]))[0]
}

function add(book, user) {
	return query(
		"INSERT INTO book (owner_id, name, author, year, cost, description) VALUES (?, ?, ?, ?, ?, ?);",
		[user.id, book.name, book.author, book.year, book.cost, book.description || null]
	)
}

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
	if (updated.description != book.description) {
		toAdd[0] += ", description=?"
		toAdd[1].push(updated.description || null)
	}
	if (toAdd[1].length == 0) return false
	toAdd[0] = toAdd[0].substring(1)
	toAdd[0] = "UPDATE book SET" + toAdd[0] + " WHERE id=?"
	return query(toAdd[0], [...toAdd[1], bookId])
}

async function remove(bookId, owner) {
	let user = (await query("SELECT * FROM user WHERE id=? AND email=?;", [owner.id, owner.email]))[0]
	if (user) {
		let res = await query("DELETE FROM book WHERE id=?;", [bookId])
		if (res.affectedRows == 1) {
			fs.unlink(path(`img/books/${bookId}.jpg`), (err) => {
				if (!err) return
				console.log(`Book ${bookId} photo wasn't removed:`)
				console.log(err)
			})
			return res
		} else return res
	}
}

async function requestsFor(bookId, user) {
	if (
		!bookId ||
		!user ||
		!user.id ||
		(await query("SELECT id FROM book WHERE id=? AND owner_id=?;", [bookId, user.id])).length == 0
	)
		return
	return await query("SELECT * FROM request WHERE book_id=?;", [bookId])
}

module.exports = {
	all,
	get,
	add,
	update,
	remove,
	requestsFor,
}
