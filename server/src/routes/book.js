const book = require("../services/book")
const path = require("../services/path")
const upload = require("multer")()
const fs = require("fs")

module.exports = (app) => {
	app.get("/api/books", (req, res) => {
		console.log(req.query)
		if (!req.query.q) book.all().then((result) => res.send(result))
		else book.search(req.query.q).then((result) => res.send(result))
	})

	//app.use(express.static("public"))
	/*app.get("/api/book/:id/pic", (req, res) => {
	book.get(req.params.id).then((book) => {
		let imageFiles = fs.readdirSync(`./public/books/${req.params.id}/`)
		book.images = new Array(imageFiles.length)
		imageFiles
			.forEach((file) => book.images.push(`/books/${req.params.id}/${file}`))
			.then(() => res.send(book))
	})
})*/

	app.get("/api/book/:id", (req, res) => {
		book.get(req.params.id).then((result) => res.send(result[0]))
	})

	// SOURCE: https://stackoverflow.com/a/31532067/12174842
	app.post("/api/book", upload.array("picRaw"), (req, res) => {
		if (
			!req.body ||
			!req.body.name ||
			!req.body.cost ||
			!req.body.author ||
			!req.body.year ||
			!req.user
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
									`POST/api/book ${result.id} saving pic, delete res: ${result.affectedRows}`
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

	app.patch("/api/book/:id", (req, res) => {
		book.update(req.params.id, req.body, req.user).then((result) => {
			if (!result) res.status(400).send({ success: false })
			else res.send({ success: true })
		})
	})

	app.delete("/api/book/:id", (req, res) => {
		book.remove(req.params.id, req.user).then((result) => {
			if (result.affectedRows != 1) res.status(400).send({ success: false })
			else res.send({ success: true })
		})
	})
}
