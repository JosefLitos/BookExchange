/**
 * Redirects given `path` to respond to current filestructure.
 */
module.exports = (path) => {
	if (process.env.NODE_ENV === "production") return `../client/build/public/${path}`
	else return `../client/public/${path}`
}
