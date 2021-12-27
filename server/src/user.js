const query = require("./sql").query
const bcrypt = require("bcrypt")

async function register(name, email, password) {
	let res = await query("SELECT * FROM user WHERE name=? OR email=?;", [name, email])
	if (res.length != 0) return
	// icon can be set via email link
	return query("INSERT INTO user (name, email, secret) VALUES (?, ?, ?);", [
		name,
		email,
		await bcrypt.hash(password, 8),
	])
}

async function login(nameOrEmail, password) {
	let user = await query("SELECT * FROM user WHERE name=? OR email=?;", [nameOrEmail, nameOrEmail])
	return user.length == 1 && bcrypt.compare(password, user[0].secret) ? user[0] : false
}

async function verify(id, secret) {
	let user = await query("SELECT * FROM user WHERE id=? AND secret=?;", [id, secret])
	return user.length == 1 ? user[0] : false
}

async function remove(id, password) {
	let user = await query("SELECT * FROM user WHERE id=?;", [id])
	if (user.length != 1 || !bcrypt.compare(password, user[0].secret)) return false
	return query("DELETE FROM user WHERE id=?;", [user[0].id])
}

async function update(id, newName, newPassword) {
	if (newName) {
		let res = await query("SELECT * FROM user WHERE id=?;", [id])
		if (res.length != 0) return
	}
	if (!newName) await query("UPDATE user SET name=? WHERE id=?;", [newName, id])
	else if (!newPassword)
		await query("UPDATE user SET secret=? WHERE id=?;", [bcrypt.hash(newPassword, 8), id])
	else if (newName && newPassword)
		await query("UPDATE user SET name=?, secret=? WHERE id=?;", [
			newName,
			bcrypt.hash(newPassword, 8),
			id,
		])
}

function books(id) {
	return query("SELECT * FROM book WHERE owner_id=?", [id])
}

module.exports = { register, login, verify, remove, update, books }
