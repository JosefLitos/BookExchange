import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import Book from "./Book"

export default function BookDetail(props) {
	const user = props.forUser || useSelector((global) => (global ? global.user : null))
	const [book, setBook] = useState({})
	useEffect(() => {
		axios
			.get(`/api/book/${props.params.id}`)
			.then((res) => setBook(res.data))
			.catch((err) => console.error(err))
	}, [])

	return book.id ? (
		<div style={{ height: "90vh", position: "relative" }}>
			<div
				style={{
					margin: "0",
					position: "absolute",
					top: "50%",
					left: "50%",
					["-ms-transform"]: "translate(-50%, -50%)",
					transform: "translate(-50%, -50%)",
				}}
			>
				{user && user.id != book.owner_id ? <Book data={book} requestable /> : <Book data={book} />}
			</div>
		</div>
	) : (
		""
	)
}
