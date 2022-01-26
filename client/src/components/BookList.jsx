import { useEffect, useState } from "react"
import { Link, useLocation, useSearchParams } from "react-router-dom"
import axios from "axios"
import Book from "./Book"
import { Grid, Link as MuiLink, Button } from "@mui/material"

function BookList(props) {
	const location = useLocation()
	const [searchParams] = useSearchParams()
	const [books, setBooks] = useState([])
	useEffect(() => {
		let q = searchParams.get("q")
		if (q && q.length >= 64) return
		axios
			.get(`/api/books/${location.search}`)
			.then((res) => setBooks(res.data))
			.catch((err) => console.log(err))
	}, [searchParams])

	return (
		<Grid container justifyContent="center" sx={{ "& > :not(style)": { m: 1 } }}>
			{books == null || books.length === 0 ? (
				<p>
					Buďte první, kdo nabídne učebnici.
					{props.user ? (
						<Link to="/commit">
							<Button variant="contained" sx={{ ml: 1 }} size="small">
								Přidat knihu
							</Button>
						</Link>
					) : (
						<MuiLink href="/api/user/login">
							<Button variant="contained" sx={{ m: 1 }} size="small">
								Přihlásit/Registrovat
							</Button>
						</MuiLink>
					)}
				</p>
			) : (
				books.map((book) => <Book key={book.id} data={book} />)
			)}
		</Grid>
	)
}

export default BookList
