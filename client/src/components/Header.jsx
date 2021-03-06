// SOURCE: https://mui.com/components/app-bar/
import { useSelector } from "react-redux"
import { Link, useNavigate, useLocation, createSearchParams } from "react-router-dom"
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
	Link as MuiLink,
} from "@mui/material"
import { Search, AccountCircle } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { green } from "@mui/material/colors"

const GreenTB = styled(Toolbar)({ backgroundColor: green[700] })

const SearchBar = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.1),
	"&:hover": { backgroundColor: alpha(theme.palette.common.black, 0.1) },
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
		[theme.breakpoints.up("sm")]: {
			width: "12ch",
			"&:focus": {
				width: "20ch",
			},
		},
	},
}))

export default function Header() {
	const user = useSelector((global) => (global ? global.user : null))
	const [anchorElUser, setAnchorElUser] = useState(null)
	const location = useLocation()
	let params = new URLSearchParams(location.search)
	let query = params.get("q")
	const navigate = useNavigate()
	useEffect(() => {
		if (query && query.length > 128) navigate({ search: null })
	}, [])
	const [searchText, setSearchText] = useState(!query || query.length > 128 ? "" : query)

	function handleOpenUserMenu(e) {
		setAnchorElUser(e.currentTarget)
	}

	function handleCloseUserMenu() {
		setAnchorElUser(null)
	}

	function search(e) {
		if (e.keyCode == 13) {
			// SOURCE: https://stackoverflow.com/a/31079244/12174842
			if (searchText == "") navigate({ search: "" })
			else if (location.pathname.startsWith("/book"))
				navigate(
					{ pathname: "/", search: `?${createSearchParams({ q: searchText })}` },
					{ replace: true }
				)
			else navigate({ search: `?${createSearchParams({ q: searchText })}` }, { replace: true })
		}
	}

	function updateSearch(e) {
		if (e.target.value.length <= 128) setSearchText(e.target.value)
		e.preventDefault()
	}

	let AccountButton
	// test for user information
	switch (user) {
		case null:
			AccountButton = (
				<Tooltip title="Server se na????t??">
					<IconButton size="large" edge="end" color="inherit">
						<Link to="/">
							<AccountCircle />
						</Link>
					</IconButton>
				</Tooltip>
			)
			break
		case undefined:
		case false:
			AccountButton = (
				<Tooltip title="P??ihl??sit/Registrovat">
					<IconButton size="large" edge="end" href="/api/user/login">
						<AccountCircle sx={{ color: "#eee" }} />
					</IconButton>
				</Tooltip>
			)
			break
		default:
			AccountButton = (
				<Box sx={{ flexGrow: 0 }}>
					<Tooltip title="Mo??nosti u??ivatele">
						<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
							<Avatar alt={user.name} src={user.icon} />
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
							["/commit", true, "P??idat knihu"],
							["/api/user/logout", false, "Odhl??sit"],
							["/user", true, "Profil"],
						].map((action) => (
							<MenuItem key={action[0]} onClick={handleCloseUserMenu}>
								<MuiLink
									{...(action[1] ? { to: action[0], component: Link } : { href: action[0] })}
									color="text.primary"
									underline="hover"
									sx={{ width: "100%" }}
								>
									<Typography textAlign="left">{action[2]}</Typography>
								</MuiLink>
							</MenuItem>
						))}
					</Menu>
				</Box>
			)
	}

	return (
		<AppBar position="sticky">
			<GreenTB>
				<Link to="/">
					<IconButton size="large" edge="start">
						<img
							src={process.env.PUBLIC_URL + "/img/logomini.png"}
							className="left-center"
							style={{ maxHeight: "40px" }}
						/>
					</IconButton>
				</Link>
				<SearchBar
					sx={location.pathname.match(/\/(\?.*|book\/.*|user.*)?$/) ? {} : { display: "none" }}
				>
					<SearchIconWrapper>
						<Search />
					</SearchIconWrapper>
					<StyledInputBase
						placeholder="Hledat"
						onKeyDown={search}
						onChange={updateSearch}
						value={searchText}
					/>
				</SearchBar>
				<Box sx={{ flexGrow: 1 }} />
				{AccountButton}
			</GreenTB>
		</AppBar>
	)
}
