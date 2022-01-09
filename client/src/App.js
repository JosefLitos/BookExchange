import React, { useEffect } from "react"
import { BrowserRouter, Route } from "react-router-dom"
import { connect } from "react-redux"
import axios from "axios"
import Header from "./components/Header"
import BookList from "./components/BookList"
import BookDetail from "./components/BookDetail"
import BookCommit from "./components/BookCommit"
import Profile from "./components/Profile"

function App(props) {
	useEffect(() => props.fetch_user(), [])
	return (
		<BrowserRouter>
			<Header />
			<Route path="/" component={BookList} />
			<Route path="/user" component={Profile} />
			<Route path="/book" component={BookDetail} />
			<Route path="/commit" component={BookCommit} />
		</BrowserRouter>
	)
}

// on user login, get profile data
export default connect(null, (dispatch) => ({
	fetch_user: () =>
		dispatch((dispatch) =>
			axios // connect to backend to decrypt the user cookie and receive contents
				.get("/api/user/info")
				.then((res) => dispatch({ type: "GET_USER", payload: res.data }))
		),
}))(App)
