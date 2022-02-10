const request = require("../services/request")

module.exports = (app) => {
	app.post("/api/request", (req, res) => {
		request.create(req.body.book_id, req.user).then((result) => {
			if (!result) res.status(400).send({ success: false })
			else res.send({ success: true })
		})
	})

	app.delete("/api/request/:id", (req, res) => {
		request.remove(req.params.id, req.user).then((result) => {
			if (result.affectedRows != 1) res.status(400).send({ success: false })
			else res.send({ success: true })
		})
	})
}
