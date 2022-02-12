import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useLocation, useSearchParams } from "react-router-dom"
import axios from "axios"
import Book from "./Book"
import { Grid, Button, Typography } from "@mui/material"

export default function BookList(props) {
	const user = props.forUser || useSelector((global) => (global ? global.user : null))
	const location = useLocation()
	const [searchParams] = useSearchParams()
	const [books, setBooks] = useState([])
	useEffect(() => {
		let q = searchParams.get("q")
		if (q && q.length >= 64) return
		axios
			.get(`/api${props.forUser ? "/user/" : "/"}books/${location.search}`)
			.then((res) => setBooks(res.data))
			.catch((err) => console.error(err))
	}, [searchParams])

	return (
		<Grid container justifyContent="center" sx={{ "& > :not(style)": { m: 1 } }}>
			{books == null ? (
				""
			) : books.length === 0 ? (
				<Typography variant="h6">
					{props.forUser
						? props.forUser
							? "Zdá se, že nenabízíte žádné knihy, pojďme to napravit:"
							: "Vyhledanému textu neodpovídají žádné knihy:"
						: "Buďte první, kdo nabídne učebnici."}
					<Link to="/commit">
						<Button variant="contained" sx={{ ml: 1 }} size="small">
							Přidat knihu
						</Button>
					</Link>
				</Typography>
			) : props.forUser ? (
				books.map((book) => (
					<div key={book.id}>
						<Book data={book} owned />
					</div>
				))
			) : user ? (
				books.map((book) => (
					<div key={book.id}>
						<Book key={book.id} data={book} requestable />
					</div>
				))
			) : (
				books.map((book) => (
					<div key={book.id}>
						<Book key={book.id} data={book} />
					</div>
				))
			)}
		</Grid>
	)
}
