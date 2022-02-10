import { Route, BrowserRouter, Routes, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import axios from "axios"
import Header from "./components/Header"
import BookList from "./components/BookList"
import BookDetail from "./components/BookDetail"
import BookCommit from "./components/BookCommit"
import User from "./components/User"

function App() {
	// on user login, get profile data
	const dispatch = useDispatch()
	axios.get("/api/user/info").then((res) => dispatch({ type: "LOGIN", payload: res.data.user }))
	const ParamWrapper = (props) => {
		const params = useParams()
		return <props.component params={params} {...props} />
	}
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<BookList />} />
				<Route path="/user" element={<User />} />
				<Route path="/book" element={<BookDetail />} />
				<Route path="/book/:id/edit" element={<ParamWrapper component={BookCommit} />} />
				<Route path="/commit" element={<BookCommit />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
