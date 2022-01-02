const book = require("../services/book")

module.exports = (app) => {
	app.get("/api/books", (req, res) => {
		if (!req.body.q) book.all().then((result) => res.send(result))
		else book.search(req.body.q).then((result) => res.send(result))
	})

	//app.use(express.static("public"))
	/*app.get("/api/bookpic/:id", (req, res) => {
	book.get(req.params.id).then((book) => {
		let imageFiles = fs.readdirSync(`./public/books/${req.params.id}/`)
		book.images = new Array(imageFiles.length)
		imageFiles
			.forEach((file) => book.images.push(`/books/${req.params.id}/${file}`))
			.then(() => res.send(book))
	})
})*/

	app.get("/api/book/:id", (req, res) => {
		book.get(req.params.id).then((result) => {
			res.send(result[0])
		})
	})

	app.post("/api/book", (req, res) => {
		book.add(req.body, req.user).then((result) => {
			if (result.affectedRows != 1) res.status(400).send({ success: false })
			else res.send({ success: true })
		})
	})

	app.patch("/api/book/:id", auth, (req, res) => {
		book.update(req.params.id, req.body, req.user).then((result) => {
			if (!result) res.status(400).send({ success: false })
			else res.send({ success: true })
		})
	})

	app.delete("/api/book/:id", auth, (req, res) => {
		book.remove(req.params.id, req.user).then((result) => {
			if (result.affectedRows != 1) res.status(400).send({ success: false })
			else res.send({ success: true })
		})
	})
}
