const passport = require("passport")
const user = require("../services/user")

module.exports = (app) => {
	app.get("/api/user/login", passport.authenticate("google", { scope: ["profile", "email"] }))
	// on singin redirect to main page
	app.get("/api/user/gcallback", passport.authenticate("google"), (req, res) =>
		res.redirect("/user")
	)

	app.get("/api/user/info", (req, res) => res.send(req.user))

	app.get("/api/user/logout", (req, res) => {
		req.logout()
		res.redirect("/")
	})

	app.get("/api/user/remove", async (req, res) => {
		if (await user.remove(req.user)) {
			req.logout()
			res.redirect("/")
		} else res.redirect("/user")
	})

	app.get("/api/user/books", (req, res)=> {
		user.books(req.user).then((books)=> res.send(books))
	})

	app.get("/api/user/requested", (req, res)=> {
		user.requestedBooks(req.user).then((requests)=> res.send(requests))
	})

	app.get("/api/user/requests", (req, res)=> {
		user.incomingRequests(req.user).then((requests)=> res.send(requests))
	})
}
