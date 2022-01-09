import React from "react"
import Card from 'react-bootstrap/Card'

class Book extends React.Component {
	constructor(props) {
		super(props)
		this.setState(props.data)
	}

	render() {
		return (
			<Card bg="light" text="dark" border="dark">
				<Card.Img
					variant="top"
					src={process.env.PUBLIC_URL + "/img/books/" + this.state.id + ".jpg"}
				/>
				<Card.Body>
					<Card.Title>{this.state.name}</Card.Title>
					<Card.Subtitle>{this.state.cost}Kč</Card.Subtitle>
					<Card.Text>
						<ul>
							<li title="Autor">{this.state.author}</li>
							<li title="Rok Vydání">{this.state.year}</li>
							<li title="Popisek">{this.state.description}</li>
						</ul>
					</Card.Text>
				</Card.Body>
			</Card>
		)
	}
}
export default Book
