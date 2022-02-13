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
	const [state, setState] = useState({ query: false, books: null })
	const [noteColor, setNoteColor] = useState("primary")
	useEffect(() => {
		let q = searchParams.get("q")
		if (q && q.length > 128) return
		axios
			.get(`/api${props.forUser ? "/user/" : "/"}books/${location.search}`)
			.then((res) => setState({ query: q, books: res.data }))
			.catch((err) => console.error(err))
	}, [searchParams])

	function createNote() {
		axios
			.post(`/api/notify${location.search}`)
			.then((res) => setNoteColor(res.data.success ? "success" : "error"))
	}

	return (
		<Grid container justifyContent="center" sx={{ "& > :not(style)": { m: 1 } }}>
			{state.books == null ? (
				""
			) : state.books.length === 0 ? (
				<Typography variant="h6">
					{props.forUser
						? state.query
							? "Vyhledanému textu neodpovídají žádné knihy:"
							: "Zdá se, že nenabízíte žádné knihy, pojďme to napravit:"
						: state.query && user
						? "Hledaná kniha nenalezena. Informujte se, až se kniha objeví:"
						: "Buďte první, kdo nabídne učebnici:"}
					{!props.forUser && state.query && user ? (
						<Button
							onClick={createNote}
							variant="contained"
							sx={{ ml: 1 }}
							size="small"
							color={noteColor}
						>
							Upozornit při dostupnosti
						</Button>
					) : (
						<Button component={Link} to="/commit" variant="contained" sx={{ ml: 1 }} size="small">
							Přidat knihu
						</Button>
					)}
				</Typography>
			) : props.forUser ? (
				state.books.map((book) => (
					<div key={book.id}>
						<Book data={book} owned />
					</div>
				))
			) : user ? (
				state.books.map((book) => (
					<div key={book.id}>
						<Book key={book.id} data={book} requestable />
					</div>
				))
			) : (
				state.books.map((book) => (
					<div key={book.id}>
						<Book key={book.id} data={book} />
					</div>
				))
			)}
		</Grid>
	)
}
