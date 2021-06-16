const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/userDB")

const app = express()

const Schema = mongoose.Schema

const userSchema = new Schema(
	{
		email: {
			type: "string",
			required: true,
		},
		password: {
			type: "string",
			required: true,
		},
	},
	{ timestamps: true }
)

const User = mongoose.model("User", userSchema)
module.exports = User

app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
)

app.get("/", function (req, res) {
	res.render("home")
})

app.get("/login", function (req, res) {
	res.render("login")
})

app.post("/login", function (req, res) {
	console.log(req)
	//TODO
	res.redirect("/")
})

app.get("/register", function (req, res) {
	res.render("register")
})

app.post("/register", function (req, res) {
	const userToStore = new User({
		email: req.body.username,
		password: req.body.password,
	})

	userToStore.save().then((e) => {
		res.redirect("/")
	})
	//TODO autologin po registeru
})

app.get("/secrets", function (req, res) {
	res.render("secrets")
	//TODO zabezpeceni
})

app.get("/submit", function (req, res) {
	res.render("submit")
	//TODO nevim co se tady dela
})

app.get("/logout", function (req, res) {
	res.render("submit")
	//TODO INVALIDACE SESSION
})

app.listen(3000, function () {
	console.log("Server poslouchá na portu 3000")
})
