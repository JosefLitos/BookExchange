const session = require("cookie-session")
const passport = require("passport")
require("dotenv").config({ path: "./.env" })
const notification = require("./services/notification")

module.exports = (app) => {
	require("./services/passport-config")

	app.use(
		session({
			maxAge: 12 * 30 * 24 * 3600000, // keep for a year
			name: "user",
			keys: [process.env.COOKIE_SECRET],
		})
	)

	app.use(passport.initialize())
	app.use(passport.session())
	app.use(require("body-parser").json({ extended: true }))

	// Registration of all available routes
	require("./routes/book")(app)
	require("./routes/user")(app)
	require("./routes/request")(app)
	app.post("/api/notify", (req, res) =>
		notification.create(req.user, req.query.q).then((ok) => res.send({ success: ok }))
	)
}
