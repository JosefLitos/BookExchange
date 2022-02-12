import { AddTask, CheckCircleOutline, RemoveCircleOutline } from "@mui/icons-material"
import {
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from "@mui/material"
import axios from "axios"
import { Component } from "react"

export default class Requests extends Component {
	constructor() {
		super()
		this.state = { requests: [] }
		axios
			.get("/api/request/forMe")
			.then((res) => {
				let lastAcceptedId = -1
				let lastId = -1
				let lastIdIndex = -1
				for (let i = 0; i < res.data.length; i++) {
					let req = res.data[i]
					if (lastAcceptedId == req.book_id) req.unacceptable = true
					else if (req.accepted == 1) {
						lastAcceptedId = req.book_id
						if (lastId == req.book_id)
							for (; lastIdIndex < i; lastIdIndex++) res.data[lastIdIndex].unacceptable = true
					}
					if (lastId != req.book_id) {
						lastId = req.book_id
						lastIdIndex = i
					}
					req.created_at = new Date(req.created_at).toLocaleString()
				}
				this.setState({ requests: res.data })
			})
			.catch((err) => console.error(err))
		this.accept = this.accept.bind(this)
		this.finish = this.finish.bind(this)
		this.reject = this.reject.bind(this)
	}

	accept(index) {
		let requests = this.state.requests
		let req = requests[index]
		req.accepted = 1
		axios.patch(`/api/request/${req.id}/accept`).then((res) => {
			if (res.data.success) {
				let i = index
				while (++i < requests.length) {
					// the array is sorted by book_id, so when they don't match, there are no more occurences
					if (requests[i].book_id != req.book_id) break
					else requests[i].unacceptable = true
				}
				while (--index >= 0) {
					if (requests[index].book_id != req.book_id) break
					else requests[index].unacceptable = true
				}
				this.setState({ requests: requests })
			}
		})
	}

	finish(index) {
		let requests = this.state.requests
		let req = requests[index]
		axios.delete(`/api/book/${req.book_id}`).then((res) => {
			if (res.data.success) {
				let i = index
				// the array is sorted by book_id, so when they don't match, there are no more occurences
				while (++i < requests.length) if (requests[i].book_id != req.book_id) break
				while (--index >= 0) if (requests[index].book_id != req.book_id) break
				requests.splice(index + 1, i - index - 1)
				this.setState({ requests: requests })
			}
		})
	}

	reject(index) {
		axios.delete(`/api/request/${this.state.requests[index].id}`).then((res) => {
			if (res.data.success) {
				let requests = this.state.requests
				let req = requests[index]
				if (req.accepted == 1) {
					for (let i = index + 1; i < requests.length; i++) {
						if (requests[i].book_id != req.book_id) break
						else requests[i].unacceptable = false
					}
					for (let i = index - 1; i >= 0; i--) {
						if (requests[i].book_id != req.book_id) break
						else requests[i].unacceptable = false
					}
				}
				requests.splice(index, 1)
				this.setState({ requests: requests })
			}
		})
	}

	render() {
		return this.state.requests.length > 0 ? (
			<TableContainer>
				<Table>
					<TableHead sx={{ height: 50 }}>
						<TableRow sx={{ "> th": { fontWeight: "bold", fontSize: 20 } }}>
							<TableCell sx={{ width: 100 }}>Volby</TableCell>
							<TableCell sx={{ width: 120 }}>Stav</TableCell>
							<TableCell sx={{ width: 200 }}>Datum zažádání</TableCell>
							<TableCell>Název knihy</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{this.state.requests.map((req, i) => {
							if (!req.unacceptable)
								return (
									<TableRow key={i}>
										<TableCell>
											{req.accepted ? (
												<Tooltip title="Označit za vyřízené">
													<IconButton onClick={() => this.finish(i)}>
														<CheckCircleOutline color="success" />
													</IconButton>
												</Tooltip>
											) : (
												<Tooltip title="Přijmout žádost">
													<IconButton onClick={() => this.accept(i)}>
														<AddTask color="success" />
													</IconButton>
												</Tooltip>
											)}
											<Tooltip title="Odstranit žádost">
												<IconButton onClick={() => this.reject(i)}>
													<RemoveCircleOutline color="error" />
												</IconButton>
											</Tooltip>
										</TableCell>
										<TableCell>{req.accepted ? "Předáváte" : "Čeká na přijetí"}</TableCell>
										<TableCell>{req.created_at}</TableCell>
										<TableCell>
											<b>{req.name}</b>
										</TableCell>
									</TableRow>
								)
						})}
					</TableBody>
				</Table>
			</TableContainer>
		) : (
			<Typography variant="h6" textAlign="center">
				Nic zde není.
			</Typography>
		)
	}
}
