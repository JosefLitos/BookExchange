import { Add, Delete, Edit, ExpandMore } from "@mui/icons-material"
import {
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Collapse,
	IconButton,
	Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import axios from "axios"
import React from "react"
import { Link } from "react-router-dom"

const Expander = styled((props) => {
	const { expand, ...other } = props
	return (
		<IconButton {...other}>
			<ExpandMore />
		</IconButton>
	)
})(({ theme, expand }) => ({
	transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
	marginLeft: "auto",
	transition: theme.transitions.create("transform", {
		duration: theme.transitions.duration.shortest,
	}),
}))

class Book extends React.Component {
	constructor(props) {
		super(props)
		this.state = props.data || {}
		this.state.expanded = false
		this.handleExpand = this.handleExpand.bind(this)
		this.add = this.add.bind(this)
		this.remove = this.remove.bind(this)
	}

	handleExpand() {
		this.setState({ expanded: !this.state.expanded })
	}

	add(e) {
		axios
			.post("/api/request", { book_id: this.state.id })
			.then((res) => this.setState({ addColour: res.data.success ? "success" : "error" }))
			.catch((err) => this.setState({ addColour: "error" }))
	}

	remove(e) {
		axios.delete(`/api/book/${this.state.id}`).then((res) => {
			if (res.data.success) this.setState({ removed: true })
		})
	}

	// SOURCE: https://mui.com/components/cards/
	render() {
		if (this.state.removed) return ""
		return (
			<Card sx={{ maxWidth: 300 }}>
				<CardMedia
					component="img"
					sx={{ maxWidth: 300, maxHeight: 400 }}
					image={this.state.picPrev || `${process.env.PUBLIC_URL}/img/books/${this.state.id}.jpg`}
					alt="[Fotka knihy není dostupná]"
				/>
				<CardContent sx={{ p: 1 }}>
					<Typography variant="h5" color="text.primary">
						{this.state.name}
					</Typography>
					<Typography sx={{ pl: 2 }} variant="h6" color="text.secondary">
						{this.state.cost} Kč
					</Typography>
				</CardContent>
				<CardActions>
					{this.props.requestable ? (
						<IconButton
							{...(this.state.addColour ? { color: this.state.addColour } : { onClick: this.add })}
						>
							<Add />
						</IconButton>
					) : (
						""
					)}
					{this.props.owned ? (
						<IconButton color="error" onClick={this.remove}>
							<Delete />
						</IconButton>
					) : (
						""
					)}
					{this.props.owned ? (
						<IconButton color="warning" component={Link} to={`/book/${this.state.id}/edit`}>
							<Edit />
						</IconButton>
					) : (
						""
					)}
					<Expander
						expand={this.state.expanded}
						onClick={this.handleExpand}
						aria-expanded={this.state.expanded}
						aria-label="more"
					/>
				</CardActions>
				<Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
					<CardContent>
						<Typography variant="h6" color="text.primary">
							Autor: {this.state.author}
							<br />
							Rok: {this.state.year}
						</Typography>
						<Typography paragraph>{this.state.description}</Typography>
					</CardContent>
				</Collapse>
			</Card>
		)
	}
}
export default Book
