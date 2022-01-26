// SOURCE: https://onestepcode.com/creating-a-material-ui-form/
// SOURCE: https://mui.com/components/text-fields
import React from "react"
import Book from "./Book"
import Compress from "client-compress"
import axios from "axios"
import { Box, Button, Grid, TextField } from "@mui/material"
import { green } from "@mui/material/colors"
import { styled } from "@mui/material/styles"
import { LoadingButton } from "@mui/lab"
import { Add } from "@mui/icons-material"

const FormBtn = styled(Button)(({ theme }) => ({
	color: theme.palette.getContrastText(green[500]),
	backgroundColor: green[500],
	"&:hover": {
		backgroundColor: green[700],
	},
}))

const Submit = styled(LoadingButton)(({ theme }) => ({
	color: theme.palette.getContrastText(green[500]),
	backgroundColor: green[500],
	"&:hover": {
		backgroundColor: green[700],
	},
}))

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
		// SOURCE: https://www.freecodecamp.org/news/react-changing-state-of-child-component-from-parent-8ab547436271/
		this.preview = React.createRef()

		this.handleChange = this.handleChange.bind(this)
		this.handleUpload = this.handleUpload.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(e) {

		// SOURCE: https://stackoverflow.com/a/43639228/12174842
		this.setState({ [e.target.id]: e.target.value })
		this.preview.current.setState({ [e.target.id]: e.target.value })
		e.preventDefault()
	}

	// TODO: find out, how to verify data and don't allow above name64, author128, description512
	async handleSubmit(e) {
		e.preventDefault()
		if (
			this.state.name.length > 64 ||
			this.state.year > 9999 ||
			this.state.cost > 9999 ||
			this.state.author.length > 128 ||
			this.state.description.length > 512
		) {
			this.setState({ failed: true })
			return
		}
		this.setState({ uploading: true, failed: false })
		const formData = new FormData()
		formData.append("name", this.state.name)
		formData.append("cost", this.state.cost)
		formData.append("author", this.state.author)
		formData.append("year", this.state.year)
		formData.append(
			"description",
			this.state.description.trim().length > 0 ? this.state.description.trim() : null
		)
		formData.append("picRaw", this.state.picRaw)
		let res
		try {
			// SOURCE: https://stackoverflow.com/a/47630754/12174842
			res = axios.post("/api/book", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})
		} catch (e) {
			console.error(e)
		}
		res = await res
		console.log(res)
		this.setState({ uploading: false, failed: !res.success })
	}

	// SOURCE: https://medium.com/@ibamibrhm/custom-upload-button-image-preview-and-image-upload-with-react-hooks-a7977618ee8c
	// SOURCE: https://stackoverflow.com/a/47443091/12174842
	handleUpload(e) {
		if (!e.target.files.length) return
		new Compress({ targetSize: 0.5, quality: 0.8, maxWidth: 900, maxHeight: 1200 })
			.compress([e.target.files[0]])
			.then((res) => {
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
			<Grid container justifyContent="center" sx={{ "& > :not(style)": { m: 1 } }}>
				<Grid
					onSubmit={this.handleSubmit}
					component="form"
					validate="true"
					autoComplete="off"
					container
					alignItems="center"
					direction="column"
				>
					<Grid
						container
						justifyContent="center"
						sx={{ "& > :not(style)": { m: 1 }, border: "1px solid grey", borderRadius: "10px" }}
					>
						{[
							["name", "Název", "text"],
							["author", "Autor", "text"],
							["year", "Rok", "number"],
							["cost", "Cena", "number"],
						].map((item) => (
							<TextField
								key={item[0]}
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
							key="description"
							id="description"
							label="Popisek Knihy"
							size="small"
							multiline
							value={this.state.description}
							onChange={this.handleChange}
						/>
						<div>
							{/*added div to stop the grid resizing of upload button*/}
							<FormBtn variant="contained" component="label">
								Nahrát fotku
								<input
									id="pic"
									accept="image/*"
									type="file"
									required
									hidden
									onChange={this.handleUpload}
								/>
							</FormBtn>
						</div>
					</Grid>
					<Submit
						variant="contained"
						startIcon={<Add />}
						loadingPosition="start"
						{...this.state.uploading ? ["loading"]: []}
						error={Boolean(this.state.failed).toString()}
						sx={{ m: 1, width: "16.5ch" }}
						type="submit"
					>
						Přidat knihu
					</Submit>
				</Grid>
				<Book ref={this.preview} className="row" />
			</Grid>
		)
	}
}

export default BookCommit
