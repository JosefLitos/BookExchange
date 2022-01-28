// SOURCE: https://onestepcode.com/creating-a-material-ui-form/
// SOURCE: https://mui.com/components/text-fields
import React from "react"
import Book from "./Book"
import Compress from "client-compress"
import axios from "axios"
import { Button, Grid, TextField, Link, Typography } from "@mui/material"
import { green } from "@mui/material/colors"
import { styled } from "@mui/material/styles"
import { LoadingButton } from "@mui/lab"
import { Add } from "@mui/icons-material"
import { connect } from "react-redux"

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

const formPrompts = {
	//id,   prompt,  type,  maxVal, isOptional
	name: ["Název", "text", 64],
	author: ["Autor", "text", 128],
	year: ["Rok", "number", new Date().getFullYear()],
	cost: ["Cena", "number", 9999],
	description: ["Popisek knihy", "text", 512, true],
}

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

	/*componentDidMount() {
		const navigate = useNavigate()
		if (!this.props.user) navigate("/", { replace: true })
	}*/

	handleChange(e) {
		e.preventDefault()
		let item = formPrompts[e.target.id]
		if (item[1] == "text") if (item[2] < e.target.value.length) return
		if (item[1] == "number") if (item[2] < e.target.value || isNaN(e.target.value)) return
		// SOURCE: https://stackoverflow.com/a/43639228/12174842
		this.setState({ [e.target.id]: e.target.value })
		this.preview.current.setState({ [e.target.id]: e.target.value })
	}

	async handleSubmit(e) {
		e.preventDefault()
		this.setState({ uploading: true, failed: false })
		const formData = new FormData()
		formData.append("name", this.state.name)
		formData.append("cost", this.state.cost)
		formData.append("author", this.state.author)
		formData.append("year", this.state.year)
		if (this.state.description.trim().length > 0)
			formData.append("description", this.state.description.trim())
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
		//TODO: clear for next book
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
						sx={{ "& > :not(style)": { m: 1 }, border: "1px solid grey", borderRadius: "10px" }}
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
							<FormBtn variant="contained" component="label">
								Nahrát fotku *
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
						{...(this.state.uploading ? ["loading"] : [])}
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

export default connect((global) => ({ user: global ? global.user : null }))(BookCommit)
