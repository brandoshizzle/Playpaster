import React, { Component } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import hash from "./hash";
import Main from "./components/Main";
import logo from "./logo.svg";
import "./App.css";
import { user } from "./store";

const LSTheme = createMuiTheme({
	palette: {
		primary: {
			main: "#0a5e54",
		},
		secondary: {
			main: "#ede8e5",
		},
	},
});

class App extends Component {
	constructor() {
		super();
		this.state = {
			token: null,
			item: {
				album: {
					images: [{ url: "" }],
				},
				name: "",
				artists: [{ name: "" }],
				duration_ms: 0,
			},
			is_playing: "Paused",
			progress_ms: 0,
		};
	}
	componentDidMount() {
		// Set token
		let _token = hash.access_token || localStorage.getItem("token");

		if (hash.access_token) {
			// Set to 30 minutes later than now
			user.tokenms = Date.now() + 30 * 60 * 1000;
		}

		if (_token) {
			// Set token
			this.setState({
				token: _token,
			});
			localStorage.setItem("token", _token);
			user.token = _token;
		}
	}

	clearLocalStorage() {
		localStorage.setItem("token", "");
	}

	render() {
		return (
			<ThemeProvider theme={LSTheme}>
				<header>
					<div className="App">
						<div className="bg">
							{!this.state.token && (
								<div className="App-header">
									<Typography
										variant="h1"
										component="h1"
										style={{
											textShadow:
												"0px 5px 10px rgba(0,0,0,0.9)",
										}}>
										Little Conductor
									</Typography>
									<a
										className="btn btn--loginApp-link"
										href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
											"%20"
										)}&response_type=token&show_dialog=true`}>
										Login to Spotify
									</a>
								</div>
							)}
						</div>
					</div>
					{this.state.token && <Main token={this.state.token} />}
				</header>
			</ThemeProvider>
		);
	}
}

export default App;
