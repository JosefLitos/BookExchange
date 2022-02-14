import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Box, Button, Divider, Typography } from "@mui/material"
import axios from "axios"
import BookList from "./BookList"
import Requests from "./Requests"
import Requested from "./Requested"

export default function User() {
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
			.catch((err) => console.error("User removal failed:\n", err))

	return (
		<Box sx={{ "> div": { m: 1, border: "1px solid grey", borderRadius: "5px" } }}>
			<Box>
				<Typography variant="h4" textAlign="center">
					Příchozí objednávky
				</Typography>
				<Requests />
			</Box>
			<Box>
				<Typography variant="h4" textAlign="center">
					Moje objednávky
				</Typography>
				<Requested />
			</Box>
			<Box>
				<Typography variant="h4" textAlign="center">
					Přehled Vámi nabízených knih
				</Typography>
				<BookList forUser={user.id} />
			</Box>
			<Button variant="contained" color="error" sx={{ m: 2, border: "none" }} onClick={onDel}>
				Smazat účet
			</Button>
		</Box>
	)
}
