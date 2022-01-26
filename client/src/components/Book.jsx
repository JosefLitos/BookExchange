import { ExpandMore } from "@mui/icons-material"
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
import React from "react"

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
		if (!this.state.prevPic) {
			this.state.picPrev = `${process.env.PUBLIC_URL}/img/books/${this.state.id}.jpg`
		}
		this.state.expanded = false
		this.handleExpand = this.handleExpand.bind(this)
	}

	handleExpand() {
		this.setState({ expanded: !this.state.expanded })
	}

	// SOURCE: https://mui.com/components/cards/
	render() {
		return (
			<Card sx={{ maxWidth: 300 }}>
				<CardMedia
					component="img"
					sx={{ maxWidth: 300, maxHeight: 400 }}
					image={this.state.picPrev}
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
						</Typography>
						<Typography paragraph>{this.state.description}</Typography>
					</CardContent>
				</Collapse>
			</Card>
		)
	}
}
export default Book
