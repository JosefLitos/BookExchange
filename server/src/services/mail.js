const path = require("path")
const hbs = require("nodemailer-express-handlebars")
const mailer = require("nodemailer").createTransport({
	service: process.env.MAIL_SERVICE,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD,
	},
})
mailer.use(
	"compile",
	hbs({
		viewEngine: { partialsDir: path.resolve("./src/mails/"), defaultLayout: false },
		viewPath: path.resolve("./src/mails/"),
	})
)

function mail(receiver, subj, template, vars) {
	vars.domain = process.env.DOMAIN
	mailer.sendMail(
		{
			from: process.env.MAIL_USER,
			to: receiver,
			subject: subj,
			template: template,
			context: vars,
		},
		(err, info) => {
			if (err) console.log("\x1b[31mEmail sender error:", err)
			else console.error("\x1b[32mEmail sent:", info.response)
			console.log({ to: receiver, subject: subj })
		}
	)
}

mail.notifyAboutBook = (receiver, book) =>
	mail(receiver, "Vámi hledaná kniha je dostupná", "bookNotify", { book: book })

module.exports = mail
