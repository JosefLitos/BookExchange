import React from "react"

class Book extends React.Component {
	constructor(props) {
		super(props)
		this.state = props.data || {}
		if (!this.state.prevPic) {
			let file = `${process.env.PUBLIC_URL}/img/books/${this.state.id}.jpg`
			try {
				require(file)
			} catch (e) {
				return
			}
			this.state.picPrev = file
		}
	}

	// SOURCE: https://react-bootstrap.github.io/components/cards/
	render() {
		return (
			<div className="row">
				<div className="col s12 m6 l4">
					<div className="card" style={{ width: "210px", height: "400px" }}>
						<div className="card-image activator waves-effect waves-block waves-light">
							<img src={this.state.picPrev} className="activator" />
						</div>
						<div className="card-content">
							<div className="row">
								<span className="card-title col s8 m4 activator">{this.state.name}</span>
								<i className="card-title material-icons col s4 m2 activator right">more_vert</i>
							</div>
							<span className="card-title grey-text text-darken-4 activator">
								Cena: {this.state.cost} Kč
							</span>
						</div>
						<div className="card-reveal">
							<div className="row">
								<span className="card-title col grey-text text-darken-4">{this.state.author}</span>
								<i className="material-icons col right">close</i>
							</div>
							<span className="card-body grey-text">{this.state.description}</span>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
export default Book
