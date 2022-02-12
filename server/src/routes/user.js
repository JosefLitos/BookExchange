const passport = require("passport")
const user = require("../services/user")

module.exports = (app) => {
	app.get(
		"/api/user/login",
		passport.authenticate("google", { scope: ["profile", "email"], failureRedirect: "/" })
	)
	// on singin redirect to main page
	app.get("/api/user/gcallback", passport.authenticate("google"), (req, res) => res.redirect("/"))

	app.get("/api/user/info", (req, res) => {
		res.send({ user: req.user })
	})

	app.get("/api/user/logout", (req, res) => {
		req.logout()
		res.redirect("/")
	})

	app.delete("/api/user", async (req, res) => {
		if (await user.remove(req.user)) {
			req.logout()
			res.send({ success: true })
		} else res.status(400).send({ success: false })
	})

	app.get("/api/user/books", (req, res) => {
		user.books(req.user, req.query.q).then((books) => res.send(books))
	})
}
