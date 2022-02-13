// SOURCE: https://onestepcode.com/creating-a-material-ui-form/
// SOURCE: https://mui.com/components/text-fields
import React from "react"
import Book from "./Book"
import Compress from "client-compress"
import axios from "axios"
import { Button, Grid, TextField, Link, Typography, Alert } from "@mui/material"
import { Add, Edit } from "@mui/icons-material"
import { connect } from "react-redux"

const formPrompts = {
	//id,   prompt,  type,  maxVal, isOptional
	name: ["Název", "text", 128],
	author: ["Autor", "text", 128],
	year: ["Rok", "number", new Date().getFullYear()],
	cost: ["Cena", "number", 9999],
	description: ["Popisek knihy", "text", 512, true],
}

const defaults = {
	name: "",
	cost: "",
	author: "",
	year: "",
	description: "",
	picPrev: false,
}

class BookCommit extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			...defaults,
			picRaw: false,
			editing: false,
			severity: false,
			alert: "",
			uploading: false,
		}
		// SOURCE: https://www.freecodecamp.org/news/react-changing-state-of-child-component-from-parent-8ab547436271/
		this.preview = React.createRef()
		if (props.params && props.params.id)
			axios.get(`/api/book/${props.params.id}/edit`).then((res) => {
				if (res.data) {
					if (!res.data.description) res.data.description = ""
					this.setState({ ...res.data, editing: true })
					this.preview.current.setState({ ...res.data })
				}
			})

		this.handleChange = this.handleChange.bind(this)
		this.handleUpload = this.handleUpload.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(e) {
		e.preventDefault()
		let item = formPrompts[e.target.id]
		if (item[1] == "text" && item[2] < e.target.value.length) return
		if (item[1] == "number" && (item[2] < e.target.value || isNaN(e.target.value))) return
		// SOURCE: https://stackoverflow.com/a/43639228/12174842
		this.setState({ severity: false, [e.target.id]: e.target.value })
		this.preview.current.setState({ [e.target.id]: e.target.value })
	}

	async handleSubmit(e) {
		e.preventDefault()
		if (this.state.uploading) {
			this.setState({ severity: "info", alert: "Prosím vyčkejte!" })
			return
		} else if (
			!this.state.name ||
			!this.state.cost ||
			!this.state.author ||
			!this.state.year ||
			!(this.state.picPrev || this.state.editing)
		) {
			this.setState({
				picMissing: !this.state.picPrev,
				severity: "warning",
				alert: "Prosím vyplňte všechna pole s *!",
			})
			return
		}
		this.setState({ uploading: true, severity: false })
		const formData = new FormData()
		formData.append("name", this.state.name)
		formData.append("cost", this.state.cost)
		formData.append("author", this.state.author)
		formData.append("year", this.state.year)
		if (this.state.description.trim().length > 0)
			formData.append("description", this.state.description.trim())
		if (this.state.picPrev) formData.append("picRaw", this.state.picRaw)
		let res
		try {
			// SOURCE: https://stackoverflow.com/a/47630754/12174842
			if (this.state.editing)
				res = await axios.patch(`/api/book/${this.props.params.id}`, formData, {
					headers: { "Content-Type": "multipart/form-data" },
				})
			else
				res = await axios.post("/api/book", formData, {
					headers: { "Content-Type": "multipart/form-data" },
				})
		} catch (e) {
			console.error(res ? res.data.error : e)
			this.setState({
				uploading: false,
				severity: "error",
				alert: "Nastala chyba při zpracování knihy, prosím zkontrolujte zadané údaje!",
			})
			return
		}
		if (res.data.success) {
			if (this.state.editing)
				this.setState({
					picPrev: false,
					picRaw: false,
					uploading: false,
					severity: "success",
					alert: "Kniha byla úspěšně upravena!",
				})
			else {
				this.setState({
					...defaults,
					picRaw: false,
					uploading: false,
					severity: "success",
					alert: "Kniha byla úspěšně vytvořena!",
				})
				this.preview.current.setState({ ...defaults })
			}
		} else if (res.status == 200)
			this.setState({
				uploading: false,
				severity: "warning",
				alert: "Pro změnu informací musíte nejprve změnit data o knížce!",
			})
		else
			this.setState({
				uploading: false,
				severity: "error",
				alert: "Nastala chyba při zpracování knihy, prosím zkontrolujte zadané údaje!",
			})
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
				this.preview.current.setState({
					severity: false,
					picMissing: false,
					picPrev: URL.createObjectURL(res[0].photo.data),
				})
			})
	}

	// SOURCE: https://reactjs.org/docs/forms.html
	// SOURCE: https://react-bootstrap.github.io/components/cards/
	render() {
		if (!this.props.user) {
			if (this.props.user != null) return ""
			return (
				<Typography textAlign="center">
					Pro přidání knížek se musíte nejprve
					<Link href="/api/user/login">
						<Button variant="contained" sx={{ m: 1 }}>
							Přihlásit
						</Button>
					</Link>
				</Typography>
			)
		}
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
						sx={{ "& > :not(style)": { m: 1 }, border: "1px solid grey", borderRadius: "5px" }}
					>
						{Object.keys(formPrompts).map((item) => (
							<TextField
								key={item}
								id={item}
								label={formPrompts[item][0]}
								size="small"
								{...{ required: !formPrompts[item][3] }}
								value={this.state[item]}
								onChange={this.handleChange}
							/>
						))}
						<div>
							{/*added div to stop the grid resizing of upload button*/}
							<Button
								color={this.state.picMissing ? "error" : "primary"}
								variant="contained"
								component="label"
							>
								Nahrát fotku{this.state.editing ? "" : " *"}
								<input id="pic" accept="image/*" type="file" hidden onChange={this.handleUpload} />
							</Button>
						</div>
					</Grid>
					<Button
						variant="contained"
						startIcon={this.state.editing ? <Edit /> : <Add />}
						sx={{ m: 2, p: "10px" }}
						type="submit"
					>
						{this.state.editing ? "Upravit knihu" : "Přidat knihu"}
					</Button>
					{this.state.severity ? (
						<Alert severity={this.state.severity}>{this.state.alert}</Alert>
					) : (
						""
					)}
				</Grid>
				<Book ref={this.preview} className="row" />
			</Grid>
		)
	}
}

export default connect((global) => ({ user: global ? global.user : null }))(BookCommit)
