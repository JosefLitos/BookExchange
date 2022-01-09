import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import axios from "axios"
import Book from "./Book"

function BookList(props) {
	const searchUpdate = (event) => {
		if (event.key === "Enter" || event.keyCode === 13) {
			let bookList = document.getElementById("BookList")
			bookList.innerHTML = null
			axios
				.get(`/books?q=${document.getElementById("search").value}`)
				.then((res) => res.books.map((book) => bookList.appendChild(<Book data={book} />)))
		}
	}

	const [books, setBooks] = useState([])
	useEffect(
		() =>
			axios
				.get("/api/books")
				.then((res) => setBooks(res.data))
				.catch((err) => console.log(err)),
		[]
	)

	return (
		<section title="BookList">
			<input id="search" type="text" placeholder="Vyhledejte knihu" onKeyUp={searchUpdate} />
			{books == null || books.length === 0 ? (
				<p>
					Buďte první, kdo nabídne učebnici.
					{props.user ? (
						<Link to="/book">
							<button>Přidat knihu</button>
						</Link>
					) : (
						<a href="/api/user/login">Přihlásit/Registrovat</a>
					)}
				</p>
			) : (
				<ul id="BookList">
					{books.map((book) => (
						<li key={book.id}>
							<Book data={book} />
						</li>
					))}
				</ul>
			)}
		</section>
	)
}

export default connect((state) => ({ user: state.user }))(BookList)
