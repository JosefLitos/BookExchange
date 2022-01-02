import React, { useEffect, useState } from "react"
import axios from "axios"
import Book from "./Book.js"

function BookList() {
	const searchUpdate = (event) => {
		if (event.key == "Enter" || event.keyCode == 13) {
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
			{books == null || books.length == 0 ? (
				<p>
					Buďte první, kdo nabídne učebnici.
					<Link to="/book">Přidat knihu</Link>
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

export default BookList
