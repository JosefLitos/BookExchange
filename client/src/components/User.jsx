import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Box, Button, Link, Typography } from "@mui/material"
import axios from "axios"
import BookList from "./BookList"

//TODO: attach searchbar for searching through owned books
function User() {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const user = useSelector((global) => {
		if (!global) return null
		if (!global.user) navigate("/", { replace: true })
		return global.user
	})
	if (!user) return ""
	const onDel = () =>
		axios
			.delete("/api/user")
			.then((res) => {
				if (res.data.success) {
					dispatch({ type: "LOGOUT" })
					navigate("/", { replace: true })
				}
			})
			.catch((err) => console.error("User removal failed"))

	return (
		<Box>
			<Typography variant="h4" textAlign="center">Přehled Vámi nabízených knih</Typography>
			<BookList forUser={user.id} />
			<Button variant="contained" color="error" sx={{ m: 1 }} onClick={onDel}>
				Smazat účet
			</Button>
		</Box>
	)
}

export default User
