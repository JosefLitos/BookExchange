import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"

function Profile(props) {
	const [state, setState] = useState({
		name: "loading",
		picture: "",
	})
	useEffect(() => {
		if (props.user)
			setState({
				icon: props.user.icon,
				name: props.user.name,
				email: props.user.email,
			})
	}, [])
	if (!props.user) props.history.push("/")

	return (
		<div>
			<h1 style={{ textAlign: "center" }}>here is your profile </h1>
			<div className="card" style={{ margin: "10%", padding: "10px", textAlign: "center" }}>
				<img className="circle" src={state.icon} alt="[User icon]" />
				<h2>{state.name}</h2>
				{state.email}
			</div>
			<a
				href="/api/user/remove"
				className="red"
				style={{ margin: "10%", padding: "10px", fontSize: "20px", color: "white" }}
			>
				Delete Account
			</a>
		</div>
	)
}

export default connect((state) => ({ user: state.user }))(Profile)
