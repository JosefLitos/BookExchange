const express = require('express')
const session = require('express-session')
const filestore = require('session-file-store')(session)
const path = require('path')
const fs = require('fs')
const PORT = process.env.PORT || 5000
const sql = require('./sql')
const user = require('./user')
const library = require('./books')

let app = express()
app.use(
	session({
		name: 'session-id',
		secret: 'your 🖕 shall 🧂 the 🔒!',
		saveUninitialized: false,
		resave: false,
		store: new filestore(),
	})
)

function auth(req, res, next) {
	if (!req.session.user)
		res.status(400).send({ success: false, message: 'Uživatel není přihlášen.' })
	else
		user.verify(req.session.user, req.session.secret).then((result) => {
			if (result) return next(true)
			else res.status(400).send({ success: false, message: 'Přihlašovací údaje jsou neplatné.' })
		})
}

// Account

app.get('/account', (req, res) => {
	;(req.body.user
		? user.login(req.body.user, req.body.password)
		: user.verify(req.session.user, req.session.secret)
	).then((result) => {
		if (result) {
			if (req.body.user && req.body.keepLogged) {
				req.session.user = result.id
				req.session.secret = result.secret
			}
			res.send({ success: true })
		} else
			res
				.status(401)
				.send({ success: false, message: 'Uživatelské jméno/email nebo heslo jsou nesprávné.' })
	})
})

app.post('/account', (req, res) => {
	if (!req.body.name || !req.body.email || !req.body.password)
		res.status(400).send({ success: false, message: 'Chybí údaje.' })
	else
		user.register(req.body.name, req.body.email, req.body.password).then((result) => {
			if (result) res.send({ success: true })
			else res.status(401).send({ success: false, message: 'Jméno nebo email již jsou obsazené.' })
		})
})

app.delete('/account', (req, res) => {
	user.remove(req.session.user, req.session.secret).then((result) => {
		if (result) res.send({ success: true, message: result })
		else res.status(401).send({ success: false, message: 'Chyba při mazání účtu.' })
	})
})

app.patch('/account', (req, res) => {
	user.update(req.body.user, req.body.newName, req.body.newPassword).then((result) => {
		if (req.body.newPassword) {
			req.session.user = undefined
			req.session.secret = undefined
		}
		res.send({ success: true, message: result })
	})
})

app.get('/account/books', auth, (req, res) => {
	user.books(req.session.user).then((result) => res.send(result))
})

// Books

app.get('/books', (req, res) => {
	if (!req.body.q) library.all().then((result) => res.send(result))
	else library.search(req.body.q).then((result) => res.send(result))
})

app.use(express.static('public'))
/*app.get("/books/:id", (req, res) => {
	library.get(req.params.id).then((book) => {
		let imageFiles = fs.readdirSync(`./public/books/${req.params.id}/`)
		book.images = new Array(imageFiles.length)
		imageFiles
			.forEach((file) => book.images.push(`/books/${req.params.id}/${file}`))
			.then(() => res.send(book))
	})
})*/

app.get('/books/:id', (req, res) => {
	library.get(req.params.id).then((result) => {
		res.send(result)
	})
})

app.delete('/books/:id', auth, (req, res) => {
	library.remove(req.params.id, req.session.user).then((result) => {
		if (!result) res.status(400).send({ success: false })
		else res.send({ success: true, message: result })
	})
})

app.patch('/books/:id', auth, (req, res) => {
	library
		.update(
			req.params.id,
			req.session.user,
			req.body.cost,
			req.body.name,
			req.body.author,
			req.body.year,
			req.body.description
		)
		.then((result) => {
			if (!result) res.status(401).send({ success: false, message: 'Chybný uživatel.' })
			else res.send({ success: true, message: result })
		})
})

// Middlewares
// app.use(auth)
// app.use(express.static(path.join(__dirname, "public")))

app.listen(PORT, () => console.log('Server is Starting'))
