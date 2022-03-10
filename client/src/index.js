import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { Provider } from "react-redux"
import { createStore } from "redux"

// user variable is used in Header to determine login state
const store = createStore((state = null, action) => {
	if (!action.payload) action.payload = undefined
	switch (action.type) {
		case "LOGOUT":
			if (state) delete state.user
			return state
		case "LOGIN":
			if (!state) return { user: action.payload }
			state.user = action.payload
			return state
		default:
			return state
	}
})

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("root")
)
