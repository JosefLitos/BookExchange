const book = require("../services/book")
const notification = require("../services/notification")
const mail = require("../services/mail")
const path = require("../services/path")
const upload = require("multer")()
const fs = require("fs")
const schedule = require("node-schedule")

module.exports = (app) => {
	app.get("/api/books", (req, res) =>
		book.all(req.user, req.query.q).then((result) => res.send(result))
	)

	app.get("/api/book/:id/edit", (req, res) => {
		book.get(req.params.id).then((result) => {
			if (req.user && result && result.owner_id == req.user.id) {
				delete result.owner_id
				res.send(result)
			} else res.send(false)
		})
	})

	app.get("/api/book/:id", (req, res) => book.get(req.params.id).then((result) => res.send(result)))

	// SOURCE: https://stackoverflow.com/a/31532067/12174842
	app.post("/api/book", upload.array("picRaw"), (req, res) => {
		if (
			!req.user ||
			!req.body ||
			!req.body.name ||
			!req.body.cost ||
			!req.body.author ||
			!req.body.year ||
			!req.files ||
			!req.files[0]
		)
			res.status(400).send({ success: false, error: "Missing book information or validation" })
		else
			book.create(req.body, req.user).then((result) => {
				if (result.affectedRows != 1) res.status(400).send({ success: false })
				else
					fs.writeFile(path(`img/books/${result.insertId}.jpg`), req.files[0].buffer, (err) => {
						if (err) {
							book.remove(result.insertId, req.user).then((result) => {
								console.error(
									"\x1b[31mPOST/api/book",
									result.id,
									"pic save error, deletion res:",
									result.affectedRows,
									err
								)
							})
							res.status(400).send({ success: false })
						} else {
							notification.checkAndNotify(req.body)
							console.log(`\x1b[32mPOST/api/book ${result.insertId} created:`, req.body)
							res.send({ success: true })
						}
					})
			})
	})

	app.patch("/api/book/:id", upload.array("picRaw"), (req, res) => {
		book.update(req.pmailarams.id, req.body, req.user).then((result) => {
			if (result === undefined) res.status(400).send({ success: false })
			else if (req.files && req.files[0])
				fs.writeFile(path(`img/books/${req.params.id}.jpg`), req.files[0].buffer, (err) => {
					if (err) {
						console.error(`\x1b[31mPATCH/api/book/${req.params.id} pic save error:`, err)
						res.status(400).send({ success: false })
					} else res.send({ success: true })
				})
			else res.send({ success: result != false })
		})
	})

	app.delete("/api/book/:id", async (req, res) => {
		let bookData = await book.get(req.params.id)
		let mailList = await book.requestsWithEmail(req.params.id)
		let result = await book.remove(req.params.id, req.user)
		if (!result || result.affectedRows != 1) res.status(400).send({ success: false })
		else {
			res.send({ success: true })
			if (mailList.length > 0) {
				mail.bookRemoved(bookData, mailList)
				let date = new Date()
				date.setMonth(date.getMonth() + 1)
				schedule.scheduleJob(
					date,
					function (bookData) {
						fs.unlink(path(`img/books/${bookData.id}.jpg`), (err) => {
							if (!err) return
							console.error(`\x1b[31mBook ${bookData.id} photo wasn't removed:`, err)
						})
					}.bind(null, bookData)
				)
			} else
				fs.unlink(path(`img/books/${bookData.id}.jpg`), (err) => {
					if (!err) return
					console.error(`\x1b[31mBook ${bookData.id} photo wasn't removed:`, err)
				})
		}
	})

	app.get("/api/book/:id/requests", (req, res) =>
		book.requestsFor(req.params.id, req.user).then((result) => {
			if (!result) res.status(400).send([])
			else res.send(result)
		})
	)
}
