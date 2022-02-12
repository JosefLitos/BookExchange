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
			if (!result) res.status(400).send({ success: false })
			else res.send({ success: true })
		})
	})

	app.post("/api/request/:id/abort", (req, res) => {
		request.abort(req.params.id, req.user).then((result) => {
			if (!result) res.status(400).send({ success: false })
			else res.send({ success: true })
		})
	})

	app.patch("/api/request/:id/accept", (req, res) => {
		request.accept(req.params.id, req.user).then((result) => {
			if (!result) res.status(400).send({ success: false })
			else res.send({ success: true })
		})
	})

	app.get("/api/request/fromMe", (req, res) => {
		request.fromUser(req.user).then((requests) => res.send(requests))
	})

	app.get("/api/request/forMe", (req, res) => {
		request.forUser(req.user).then((requests) => res.send(requests))
	})
}
