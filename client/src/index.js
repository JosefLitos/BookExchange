import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { Provider } from "react-redux"
import { createStore, combineReducers, compose, applyMiddleware } from "redux"
import thunk from "redux-thunk"

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// user variable is used in Header to determine login state
const store = createStore(
	combineReducers({
		user: (state = null, action) => {
			switch (action.type) {
				case "GET_USER":
					return action.payload || false
				default:
					return state
			}
		},
	}),
	composeEnhancers(applyMiddleware(thunk))
)

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("root")
)
