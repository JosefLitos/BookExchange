const query = require("./sql")(process.env.MYSQL_DB)
const mail = require("./mail")

async function create(user, q) {
	if (q && user && user.id)
		if (
			(
				await query("SELECT * FROM notification WHERE user_id=? AND query=?", [user.id, q], true)
			)[0] ||
			(await query("INSERT INTO notification (user_id, query) VALUES (?, ?);", [user.id, q]))
				.affectedRows == 1
		)
			return true
}

function remove(notificationId) {
	if (notificationId) query("DELETE FROM notification WHERE id=?;", [notificationId])
}

function removeOld() {
	return query("DELETE FROM notification WHERE created_at < (NOW() - INTERVAL 1 YEAR);")
}

/*
	Returns <user> if their notification has been resolved.
*/
function findByBook(book) {
	return query(
		"SELECT user.*, notification.id as note_id FROM user INNER JOIN notification ON ? LIKE CONCAT('%', query, '%') WHERE user_id=user.id;",
		[book.name],
		true
	)
}

async function checkAndNotify(book) {
	let user = (await findByBook(book))[0]
	if (user && user.id != book.owner_id) {
		mail.notifyAboutBook(user.email, book)
		remove(user.note_id)
	}
}

module.exports = { create, remove, removeOld, findByBook, checkAndNotify }
