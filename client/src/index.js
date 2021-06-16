import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import './index.css'

import Book from './book'

const request = (path) => {
	axios.get(`127.0.0.1:5000${path}`).then((response) => response.data)
}

const searchUpdate = (event) => {
	if (event.key == 'Enter' || event.keyCode == 13) {
		let bookList = document.getElementById('bookList')
		bookList.innerHTML = null
		getRequest(`/books?q=${document.getElementById('search').value}`).then((books) =>
			books.map((book) => bookList.appendChild(<Book data={book} />))
		)
	}
}

ReactDOM.render(
	<React.StrictMode>
		<div>
			<input id="search" type="text" placeholder="Vyhledejte knihu" onKeyUp={searchUpdate} />
		</div>
		<section>
			<ul id="bookList">
				{request('/books').then((data) =>
					data.map((book) => (
						<li key={book.id}>
							<Book data={book} />
						</li>
					))
				)}
			</ul>
		</section>
	</React.StrictMode>,
	document.getElementById('root')
)
