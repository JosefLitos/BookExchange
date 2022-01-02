const user = require("./user")
const passport = require("passport")
const GooleStrategy = require("passport-google-oauth20").Strategy

passport.serializeUser((user, done) => done(null, { id: user.id, email: user.email }))
passport.deserializeUser((user, done) => user.login(user).then((res) => done(null, res)))
passport.use(
	new GooleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "/api/user/gcallback",
			proxy: true,
		},
		(accessToken, refreshToken, profile, done) => {
			console.log("User Login: ", profile.displayName, "-", profile.name)
			user
				.login({
					id: profile.id,
					name: profile.displayName,
					email: profile.emails[0].value,
					icon: profile.photos[0].value,
				})
				.then((res) => done(null, res))
		}
	)
)
