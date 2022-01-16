// SOURCE: https://mui.com/components/app-bar/
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { styled, alpha } from "@mui/material/styles"
import {
	AppBar,
	Box,
	Toolbar,
	IconButton,
	InputBase,
	MenuItem,
	Menu,
	Avatar,
	Tooltip,
	Typography,
} from "@mui/material"
import { Search, AccountCircle } from "@mui/icons-material"
import React from "react"

const SearchBar = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	"&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.25) },
	marginLeft: 0,
	marginRight: 3,
	width: "100%",
	[theme.breakpoints.up("sm")]: { marginLeft: theme.spacing(3), width: "auto" },
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		width: "100%",
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
	},
}))

function Header(props) {
	const [anchorElUser, setAnchorElUser] = React.useState(null)

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget)
	}

	const handleCloseUserMenu = () => {
		setAnchorElUser(null)
	}
	const userLinks = () => {
		// test for user information
		switch (props.user) {
			case null:
				return (
					<Tooltip title="Server se načítá">
						<IconButton size="large" edge="end" color="inherit">
							<a href="/">
								<AccountCircle />
							</a>
						</IconButton>
					</Tooltip>
				)
			case undefined:
			case false:
				return (
					<Tooltip title="Přihlásit/Registrovat">
						<IconButton size="large" edge="end" color="inherit">
							<a href="/api/user/login">
								<AccountCircle />
							</a>
						</IconButton>
					</Tooltip>
				)
			default:
				return (
					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Možnosti uživatele">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar alt={props.user.name} src={props.user.icon} />
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: "45px" }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{ vertical: "top", horizontal: "right" }}
							keepMounted
							transformOrigin={{ vertical: "top", horizontal: "right" }}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{[
								["Commit", <Link to="/commit">Přidat knihu</Link>],
								["Logout", <a href="/api/user/logout">Odhlásit</a>],
								["Profile", <Link to="/user">Profil</Link>],
							].map((action) => (
								<MenuItem key={action[0]} onClick={handleCloseUserMenu}>
									<Typography textAlign="center">{action[1]}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
				)
		}
	}

	return (
		<React.Fragment>
			<AppBar position="sticky">
				<Toolbar>
					<Link to="/">
						<IconButton size="large" edge="start">
							<img
								src={process.env.PUBLIC_URL + "/img/logomini.png"}
								className="left-center"
								style={{ maxHeight: "40px" }}
							/>
						</IconButton>
					</Link>
					<SearchBar>
						<SearchIconWrapper>
							<Search />
						</SearchIconWrapper>
						<StyledInputBase placeholder="Hledat" />
					</SearchBar>
					<Box sx={{ flexGrow: 1 }} />
					{userLinks()}
				</Toolbar>
			</AppBar>
		</React.Fragment>
	)
}

export default connect((state) => ({ user: state.user }))(Header)
