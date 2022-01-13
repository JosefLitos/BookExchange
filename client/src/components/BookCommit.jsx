import React from "react"
import Book from "./Book"
import Compress from "client-compress"
import axios from "axios"

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
		console.log(this.state)
		// SOURCE: https://www.freecodecamp.org/news/react-changing-state-of-child-component-from-parent-8ab547436271/
		this.preview.current.setState({ [e.target.id]: e.target.value })
		e.preventDefault()
	}

	handleSubmit(e) {
		const formData = new FormData()
		formData.append("name", this.state.name)
		formData.append("cost", this.state.cost)
		formData.append("author", this.state.author)
		formData.append("year", this.state.year)
		formData.append("description", this.state.description)
		formData.append("picPrev", this.state.picPrev)
		formData.append("picRaw", this.state.picRaw)
		// SOURCE: https://stackoverflow.com/a/47630754/12174842
		if (false)
			axios({
				method: "post",
				url: "/api/book",
				data: formData,
				headers: { "Content-Type": "multipart/form-data" },
			})
		else alert(JSON.stringify(formData))
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
					<form onSubmit={this.handleSubmit} className="col s12"style={{border:"black 10px"}}>
						<div className="input-field row">
							<input
								required
								type="text"
								id="name"
								value={this.state.name}
								onChange={this.handleChange}
							></input>
							<label htmlFor="name">Název</label>
						</div>
						<div className="input-field row">
							<input
								required
								type="text"
								id="author"
								value={this.state.author}
								onChange={this.handleChange}
							/>
							<label htmlFor="author">Autor</label>
						</div>
						<div className="row">
							<div className="input-field col s6">
								<input
									required
									type="number"
									id="year"
									value={this.state.year}
									onChange={this.handleChange}
								/>
								<label htmlFor="year">Rok vydání</label>
							</div>
							<div className="input-field col s6">
								<input
									required
									type="number"
									id="cost"
									value={this.state.cost}
									onChange={this.handleChange}
								/>
								<label htmlFor="cost">Cena</label>
							</div>
						</div>
						<div className="input-field row">
							<textarea
								className="materialize-textarea"
								type="text"
								id="description"
								value={this.state.description}
								onChange={this.handleChange}
							/>
							<label htmlFor="text">Popis knihy</label>
						</div>
						<div className="file-field input-field row">
							<div className="btn">
								<span>Nahrát fotku</span>
								<input
									required
									type="file"
									accept="image/*"
									id="pic"
									onChange={this.handleUpload}
								></input>
							</div>
						</div>
						<input type="submit" value="Přidat" />
					</form>
				<Book ref={this.preview} className="row" />
			</div>
		)
	}
}

export default BookCommit
