import React, { useState, useEffect } from "react";
// import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import useAxios from "axios-hooks";
import { view } from "@risingstack/react-easy-state";
import { user } from "./../store";

import SearchPage from "./SearchPage";

// const useStyles = makeStyles((theme) => ({
// 	root: {
// 		flexGrow: 1,
// 		height: "calc(100vh - 48px)",
// 		// backgroundColor: theme.palette.background.paper,
// 	},
// }));

const Main = (props) => {
	// const classes = useStyles();
	const { token } = props;
	const [tokenTimeout, setTokenTimout] = useState(user.tokenms - Date.now());

	useEffect(() => {
		const tokenTimeoutInterval = setInterval(() => {
			setTokenTimout(user.tokenms - Date.now());
			if (tokenTimeout < 1000) {
				try {
					tokenTimeoutInterval.clear();
				} catch (e) {
					console.log("Tried to clear interval, could not. Oh well.");
				}
			}
		}, 60000);
	}, []);

	const [{ data, loading, error }] = useAxios({
		url: "https://api.spotify.com/v1/me",
		method: "GET",
		headers: {
			Authorization: "Bearer " + token,
		},
	});

	if (loading) {
		console.log("Loading user...");
	}

	if (data) {
		// console.log(data);
		user.name = data.display_name;
		user.id = data.id;
	}

	if (user.id !== "") {
		return <SearchPage token={token} />;
	}

	if (error) {
		return (
			<div>
				<p>
					If you're seeing this, click this button, then refresh the
					page.
				</p>
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						localStorage.setItem("token", "");
					}}>
					Clear Token
				</Button>
			</div>
		);
	}

	return (
		<div>
			<p>Loading...</p>
		</div>
	);
};

export default view(Main);
