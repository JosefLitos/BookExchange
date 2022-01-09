import React from "react"
import axios from "axios"

// SOURCE: https://medium.com/@ibamibrhm/custom-upload-button-image-preview-and-image-upload-with-react-hooks-a7977618ee8c
// SOURCE: https://reactjs.org/docs/forms.html
// SOURCE: https://react-bootstrap.github.io/components/cards/
class BookCommit extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			name: "",
			cost: null,
			author: "",
			year: null,
			description: "",
			picPrev: "",
			picRaw: "",
		}
		//this.handleChange = this.handleChange.bind(this)
	}

	// SOURCE: https://stackoverflow.com/a/43639228/12174842
	handleChange(event) {
		switch (event.target.name) {
			case "name":
				this.setState((prevState) => ({ ...prevState, name: event.target.value }))
				break
			case "cost":
				this.setState((prevState) => ({ ...prevState, cost: event.target.value }))
				break
			case "author":
				this.setState((prevState) => ({ ...prevState, author: event.target.value }))
				break
			case "year":
				this.setState((prevState) => ({ ...prevState, year: event.target.value }))
				break
			case "description":
				this.setState((prevState) => ({ ...prevState, description: event.target.value }))
				break
			default:
				console.log(event.target)
		}
		console.log("new state:")
		console.log(this.state)
	}

	handleSubmit(event) {
		event.preventDefault()
		const formData = new FormData()
		formData.append("name", this.state.name)
		formData.append("cost", this.state.cost)
		formData.append("author", this.state.author)
		formData.append("year", this.state.year)
		formData.append("description", this.state.description)
		formData.append("picPrev", this.state.picPrev)
		formData.append("picRaw", this.state.picRaw)
		// SOURCE: https://stackoverflow.com/a/47630754/12174842
		axios({
			method: "post",
			url: "/api/book",
			data: formData,
			headers: { "Content-Type": "multipart/form-data" },
		})
	}

	// SOURCE: https://medium.com/@ibamibrhm/custom-upload-button-image-preview-and-image-upload-with-react-hooks-a7977618ee8c
	handleUpload(event) {
		if (event.target.files.length) {
			this.setState((prevState) => ({
				...prevState,
				picPrev: URL.createObjectURL(event.target.files[0]),
				picRaw: event.target.files[0],
			}))
		}
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Název:
					<input type="text" name="name" value={this.state.name} />
				</label>
				<label>
					Cena:
					<input type="number" name="cost" value={this.state.cost} />
				</label>
				<label>
					Autor:
					<input type="text" name="author" value={this.state.author} />
				</label>
				<label>
					Rok vydání:
					<input type="number" name="year" value={this.state.year} />
				</label>
				<label>
					Popis:
					<textarea type="text" name="description" value={this.state.description} />
				</label>
				<label>
					{this.state.picPrev ? (
						<img src={this.state.picPrev} alt="Náhledová fotka" width="300" height="300" />
					) : (
						<h5 className="text-center">Nahrát fotku:</h5>
					)}
					<input
						type="file"
						name="pic"
						style={{ display: "none" }}
						onChange={this.handleUpload}
					></input>
				</label>
				<input type="submit" value="Přidat" />
			</form>
		)
	}
}

export default BookCommit
