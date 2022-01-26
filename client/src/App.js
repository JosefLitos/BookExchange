import React, { useEffect } from "react"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import { connect, useDispatch } from "react-redux"
import axios from "axios"
import Header from "./components/Header"
import BookList from "./components/BookList"
import BookDetail from "./components/BookDetail"
import BookCommit from "./components/BookCommit"
import Profile from "./components/Profile"

function App(props) {
	const dispatch = useDispatch()
	useEffect(() => axios.get("/api/user/info").then(res => dispatch({type: "GET_USER", payload: res.data})), [])
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<BookList />} />
				<Route path="/user" element={<Profile />} />
				<Route path="/book" element={<BookDetail />} />
				<Route path="/commit" element={<BookCommit />} />
			</Routes>
		</BrowserRouter>
	)
}

// on user login, get profile data
export default App
