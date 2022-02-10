const book = require("../services/book")
const path = require("../services/path")
const upload = require("multer")()
const fs = require("fs")

module.exports = (app) => {
	app.get("/api/books", (req, res) =>
		book.all(req.user, req.query.q).then((result) => res.send(result))
	)

	app.get("/api/book/:id", (req, res) => {
		book.get(req.params.id).then((result) => res.send(result))
	})

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
			book.add(req.body, req.user).then((result) => {
				if (result.affectedRows != 1) res.status(400).send({ success: false })
				else
					fs.writeFile(path(`img/books/${result.insertId}.jpg`), req.files[0].buffer, (err) => {
						if (err) {
							book.remove(result.insertId, req.user).then((result) => {
								console.log(
									`POST/api/book ${result.id} pic save error, deletion res: ${result.affectedRows}`
								)
							})
							res.status(400).send({ success: false })
						} else {
							console.log(`POST/api/book ${result.insertId} added:`)
							console.log(req.body)
							res.send({ success: true })
						}
					})
			})
	})

	app.patch("/api/book/:id", upload.array("picRaw"), (req, res) => {
		book.update(req.params.id, req.body, req.user).then((result) => {
			if (result === undefined) res.status(400).send({ success: false })
			else if (req.files && req.files[0])
				fs.writeFile(path(`img/books/${req.params.id}.jpg`), req.files[0].buffer, (err) => {
					if (err) {
						console.log(`PATCH/api/book/${req.params.id} pic save error:`)
						console.err(err)
						res.status(400).send({ success: false })
					} else res.send({ success: true })
				})
			else res.send({ success: result != false })
		})
	})

	app.delete("/api/book/:id", (req, res) => {
		book.remove(req.params.id, req.user).then((result) => {
			if (result.affectedRows != 1) res.status(400).send({ success: false })
			else res.send({ success: true })
		})
	})

	app.get("/api/book/:id/requests", (req, res) =>
		book.requestsFor(req.params.id, req.user).then((result) => {
			if (!result) res.status(400).send([])
			else res.send(result)
		})
	)
}
