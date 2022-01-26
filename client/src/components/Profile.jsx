import { useSelector } from "react-redux"
import { Box, Button, Link, Typography } from "@mui/material"

function Profile() {
	const user = useSelector((global) => global.user)
	if (!user) {
		return (
			<Box>
				<Typography textAlign="center">Prosím přihlaste se.</Typography>
				<Link href="/api/user/login">Přihlásit</Link>
			</Box>
		)
	} else
		return (
			<Box>
				<h1 style={{ textAlign: "center" }}>here is your profile </h1>
				<div className="card" style={{ margin: "10%", padding: "10px", textAlign: "center" }}>
					<img className="circle" src={user.icon} alt="[User icon]" />
					<h2>{user.name}</h2>
					{user.email}
				</div>
				<Link href="/api/user/remove">
					<Button variant="contained" color="error" sx={{ m: 1 }}>
						Smazat účet
					</Button>
				</Link>
			</Box>
		)
}

export default Profile
