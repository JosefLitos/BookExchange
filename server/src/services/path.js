module.exports = (path) => {
	if (process.env.NODE_ENV === "production") return `../client/build/public/${path}`
	else return `../client/public/${path}`
}
