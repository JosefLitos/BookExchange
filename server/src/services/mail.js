const book = require("./book")
const user = require("./user")
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
			if (err) console.error("\x1b[31mEmail sender error:", err)
			else console.log("\x1b[32mEmail sent:", { to: receiver, subject: subj })
		}
	)
}

function bookNotify(receiver, bookData) {
	mail(receiver, "Vámi hledaná kniha je dostupná", "template", {
		book: bookData,
		header: "Někdo přidal knihu, kterou jste možná hledali",
		btn: "Zobrazit knihu",
		href: `${process.env.DOMAIN}/book/${bookData.id}`,
	})
}

async function sendRequest(bookId) {
	let bookData = await book.get(bookId)
	let userData = await user.info(bookData.owner_id)
	mail(userData.email, "Někdo odpověděl na Váš inzerát", "template", {
		book: bookData,
		header: "Někdo si zažádal o Vaši knihu",
		btn: "Zobrazit žádanky",
		href: `${process.env.DOMAIN}/user`,
	})
}

async function requestAborted(bookId) {
	let bookData = await book.get(bookId)
	let userData = await user.info(bookData.owner_id)
	mail(userData.email, "Někdo zrušil svou žádost o Vaši knihu", "template", {
		book: bookData,
		header: "Žádost o Vaši knihu byla zrušena",
		subtitle: "Uživatel žádající o Vaši knihu už o tuto knihu nemá zájem.",
		btn: "Zobrazit žádanky",
		href: `${process.env.DOMAIN}/user`,
	})
}

async function requestDeclined(request) {
	let bookData = await book.get(request.book_id)
	let userData = await user.info(request.customer_id)
	mail(userData.email, "Vaše žádost o knihu byla zrušena", "template", {
		book: bookData,
		header: "Vlastník knihy odmítl Vaši žádost",
		subtitle: "Tato situace může nastat, pokud již majitel knihy našel jiného kupce.",
		btn: "Zobrazit žádosti",
		href: `${process.env.DOMAIN}/user`,
	})
}

function bookRemoved(bookData, requests) {
	requests.forEach((request) =>
		mail(request.email, "Vyžádaná kniha byla odstraněna", "template", {
			book: bookData,
			header: "Vlastník hledanou knihu odstranil z nabídky",
			subtitle: "Majitel knihy změnil názor, nebo již knihu někomu prodal.",
			btn: "Zobrazit žádosti",
			href: `${process.env.DOMAIN}/user`,
		})
	)
}

async function requestAccepted(owner, customerId, bookData) {
	let customer = await user.info(customerId)
	mail(owner.email, "Přijali jste žádost o knihu", "template", {
		book: bookData,
		header: `Přijali jste žádost od uživatele jménem ${customer.name}`,
		subtitle: "Prosím, domluvte se s žadatelem na místě předání.",
		btn: "Napsat žadateli",
		href: encodeURI(
			`mailto:${customer.email}?subject=Domluva o předání knihy&body=Dobrý den,\nrád bych se s Vámi domluvil, kdy a kde bych Vám mohl předat tuto knihu:\n${bookData.name}\nProsím, kontaktujte mne co nejdříve.\n\nS přáním hezkého dne,\n${owner.name}`
		),
	})

	mail(customer.email, "Vaše žádost o knihu byla přijata", "template", {
		book: bookData,
		header: `Uživatel ${owner.name} přijal Vaši žádost`,
		subtitle: "Prosím, domluvte se s majitelem na místě předání.",
		btn: "Napsat inzerujícímu",
		href: encodeURI(
			`mailto:${owner.email}?subject=Domluva o předání knihy&body=Dobrý den,\nrád bych se s Vámi domluvil, kdy a kde bych od Vás mohl převzít tuto knihu:\n${bookData.name}\nProsím, kontaktujte mne co nejdříve.\n\nS přáním hezkého dne,\n${customer.name}`
		),
	})
}

module.exports = {
	bookNotify,
	sendRequest,
	requestAborted,
	requestDeclined,
	bookRemoved,
	requestAccepted,
}
