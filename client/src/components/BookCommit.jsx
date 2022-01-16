// SOURCE: https://onestepcode.com/creating-a-material-ui-form/
// SOURCE: https://mui.com/components/text-fields
import React from "react"
import Book from "./Book"
import Compress from "client-compress"
import axios from "axios"
import { Box, Button, Grid, TextField } from "@mui/material"

class BookCommit extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			name: "",
			cost: "",
			author: "",
			year: "",
			description: "",
			picPrev: "",
			picRaw: "",
		}
		this.preview = React.createRef()

		this.handleChange = this.handleChange.bind(this)
		this.handleUpload = this.handleUpload.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(e) {
		// SOURCE: https://stackoverflow.com/a/43639228/12174842
		this.setState({ [e.target.id]: e.target.value })
		// SOURCE: https://www.freecodecamp.org/news/react-changing-state-of-child-component-from-parent-8ab547436271/
		this.preview.current.setState({ [e.target.id]: e.target.value })
		e.preventDefault()
	}

	handleSubmit(e) {
		// TODO: find out, how to verify data and don't allow above name64, author128, description512
		const formData = new FormData()
		formData.append("name", this.state.name)
		formData.append("cost", this.state.cost)
		formData.append("author", this.state.author)
		formData.append("year", this.state.year)
		formData.append("description", this.state.description)
		formData.append("picRaw", this.state.picRaw)
		// SOURCE: https://stackoverflow.com/a/47630754/12174842
		axios.post("/api/book", formData, { headers: { "Content-Type": "multipart/form-data" } })
		//axios.post("/api/book", this.state, { headers: { "Content-Type": "application/json" } })
		e.preventDefault()
	}

	// SOURCE: https://medium.com/@ibamibrhm/custom-upload-button-image-preview-and-image-upload-with-react-hooks-a7977618ee8c
	// SOURCE: https://stackoverflow.com/a/47443091/12174842
	handleUpload(e) {
		if (!e.target.files.length) return
		new Compress({ targetSize: 0.5, quality: 0.8, maxWidth: 900, maxHeight: 1200 })
			.compress([e.target.files[0]])
			.then((res) => {
				console.log(res[0])
				this.setState({
					picPrev: URL.createObjectURL(res[0].photo.data),
					picRaw: res[0].photo.data,
				})
				this.preview.current.setState({ picPrev: URL.createObjectURL(res[0].photo.data) })
			})
	}

	// SOURCE: https://reactjs.org/docs/forms.html
	// SOURCE: https://react-bootstrap.github.io/components/cards/
	render() {
		return (
			<div style={{ margin: "10px" }}>
				<Grid
					onSubmit={this.handleSubmit}
					component="form"
					validate
					autoComplete="off"
					container
					justify="center"
					alignItems="center"
					direction="column"
				>
					<Box
						sx={{ "& > :not(style)": { m: 1 }, border: "1px solid grey", "border-radius": "10px" }}
					>
						{[
							["name", "Název", "text"],
							["author", "Autor", "text"],
							["year", "Rok", "number"],
							["cost", "Cena", "number"],
						].map((item) => (
							<TextField
								id={item[0]}
								label={item[1]}
								type={item[2]}
								size="small"
								required
								value={this.state[item[0]]}
								onChange={this.handleChange}
							/>
						))}
						<TextField
							label="Popisek Knihy"
							id="description"
							size="small"
							multiline
							value={this.state.description}
							onChange={this.handleChange}
						/>
						<Button variant="contained" component="label">
							Nahrát fotku
							<input
								id="pic"
								accept="image/*"
								type="file"
								required
								hidden
								onChange={this.handleUpload}
							/>
						</Button>
					</Box>
					<Button variant="contained" sx={{ m: 1, width: "15ch" }} type="submit">
						Přidat knihu
					</Button>
				</Grid>
				<Book ref={this.preview} className="row" />
			</div>
		)
	}
}

export default BookCommit
