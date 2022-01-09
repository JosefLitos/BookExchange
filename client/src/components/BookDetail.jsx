import React from "react"

class Book extends React.Component {
	constructor(props) {
		super(props)
		this.setState(props.data)
	}

	render() {
		return (
			<div>
				<hi3>{this.state.name}</hi3>
				<ul>
					<li title="Autor">{this.state.author}</li>
					<li title="Rok Vydání">{this.state.year}</li>
					<li title="Popisek">{this.state.description}</li>
					<li title="Cena">{this.state.cost}</li>
				</ul>
			</div>
		)
	}
}
export default Book
