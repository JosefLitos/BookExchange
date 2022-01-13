import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"

function Header(props) {
	const createLinks = () => {
		// test for user information
		switch (props.user) {
			case null:
				return (
					<li>
						<a href="/">Stránka se načítá...</a>
					</li>
				)
			case undefined:
			case false:
				return (
					<li>
						<a href="/api/user/login">Přihlásit/Registrovat</a>
					</li>
				)
			default:
				return (
					<React.Fragment>
						<li>
							<Link to="/commit">Přidat knihu</Link>
						</li>
						<li>
							<a href="/api/user/logout">Odhlásit</a>
						</li>
						<li>
							<Link to="/user">
								<img
									className="circle"
									src={props.user.icon}
									alt="Profil"
									width="40"
									style={{ verticalAlign: "middle" }}
								/>
							</Link>
						</li>
					</React.Fragment>
				)
		}
	}

	return (
		<nav>
			<div className="nav-wrapper green darken-2">
				<img
					src={process.env.PUBLIC_URL + "/img/logomini.png"}
					className="left-center"
					style={{ padding: "2px", maxHeight: "100%" }}
				/>
				<Link to={props.user ? "/user" : "/"} className="brand-logo">
					Bazar Učebnic GA - BUG
				</Link>
				<ul id="nav-mobile" className="right">
					{createLinks()}
				</ul>
			</div>
		</nav>
	)
}

export default connect((state) => ({ user: state.user }))(Header)
