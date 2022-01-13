const query = require("./sql")(process.env.MYSQL_DB)

async function login(user) {
	if (!user || !user.id || !user.email) return null
	let users = await query("SELECT * FROM user WHERE id=? AND email=?;", [user.id, user.email])
	if (users.length > 0) {
		if (users[0].name != user.name && user.name) {
			if (users[0].icon != user.icon && user.icon)
				query("UPDATE user SET name=?, icon=? WHERE id=?;", [user.name, user.icon, user.id])
			else query("UPDATE user SET name=? WHERE id=?;", [user.name, user.id])
		} else if (users[0].icon != user.icon && user.icon)
			query("UPDATE user SET name=? WHERE id=?;", [user.icon, user.id])
		return users[0]
	} else if (
		// users that matched one parameter of other users would create partial duplicates
		(await query("SELECT * FROM user WHERE id=? OR email=?;", [user.id, user.email])).length > 0
	)
		return null
	return (
		await query("INSERT INTO user (id, name, email, icon) VALUES (?, ?, ?, ?);", [
			user.id,
			user.name,
			user.email,
			user.icon,
		])
	).affectedRows != 1
		? null
		: user
}

async function remove(user) {
	if (!user || !user.id || !user.email) return null
	let res = await query("DELETE FROM user WHERE id=? AND email=?;", [user.id, user.email])
	if (res.affectedRows != 1)
		return console.log(`SQL - Error when deleting user ${user.email}, response: ${res}`)
	return true
}

function books(user) {
	return query("SELECT * FROM book WHERE owner_id=?;", [user.id])
}

function requestedBooks(user) {
	return query("SELECT * FROM request WHERE customer_id=? INNER JOIN book ON book_id=book.id;", [
		user.id,
	])
}

function incomingRequests(user) {
	return query(
		"SELECT * FROM book WHERE owner_id=? INNER JOIN request ON book.id=book_id;",
		[user.id]
	)
}

module.exports = { login, remove, books, requestedBooks, incomingRequests }
