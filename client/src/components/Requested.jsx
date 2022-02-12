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

export default class Requested extends Component {
	constructor() {
		super()
		this.state = { requests: [] }
		axios
			.get("/api/request/fromMe")
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
		this.abort = this.abort.bind(this)
	}

	abort(index) {
		axios.post(`/api/request/${this.state.requests[index].id}/abort`).then((res) => {
			if (res.data.success) {
				this.state.requests.splice(index, 1)
				this.setState({ requests: this.state.requests })
			}
		})
	}

	render() {
		return this.state.requests.length > 0 ? (
			<TableContainer>
				<Table>
					<TableHead sx={{ height: 50 }}>
						<TableRow sx={{ "> th": { fontWeight: "bold", fontSize: 20 } }}>
							<TableCell sx={{ width: 100 }}>Zrušit</TableCell>
							<TableCell sx={{ width: 120 }}>Stav</TableCell>
							<TableCell sx={{ width: 200 }}>Datum zažádání</TableCell>
							<TableCell>Název knihy</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{this.state.requests.map((req, i) => {
							return (
								<TableRow key={i}>
									<TableCell>
										<Tooltip title="Zrušit žádost">
											<IconButton onClick={() => this.abort(i)}>
												<RemoveCircleOutline color="error" />
											</IconButton>
										</Tooltip>
									</TableCell>
									<TableCell>{req.accepted ? "Přijato" : "Zažádáno"}</TableCell>
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
