import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { nameFilter } from "./filters";

function clearAnd

const SearchPage = (props) => {
	const { token } = props;
	const [searchTerm, setSearchTerm] = useState("");
	const [playlists, setPlaylists] = useState([]);
	const [offset, setOffset] = useState(0);
	const [playlistsToKeep, setPlaylistsToKeep] = useState([]);

	useEffect(() => {
		console.log(token);
	}, []);

	const handleChange = (event) => {
		setSearchTerm(event.target.value);
		console.log(event.key);
	};
	const _handleKeyDown = (e) => {
		if (e.key === "Enter") {
			searchTime();
		}
	};

	const addToList = (e) => {
		const playlistID = e.target.id;
		document.getElementById(e.target.id).parentElement.style.opacity = 0.2;
		setPlaylistsToKeep([...playlistsToKeep, playlistID]);
	};

	async function searchTime() {
		console.log(searchTerm);
		let playlistsTemp = [];
		let nextLink;
		let batchNum = 1;
		do {
			const res = await axios.get(
				nextLink ||
					`https://api.spotify.com/v1/search?q=${searchTerm}&type=playlist&limit=50&offset=${offset}`,
				{
					headers: {
						Authorization: "Bearer " + token,
						"Content-Type": "application/json",
					},
				}
			);
			// Make sure the response is good
			nextLink = res.data.playlists.next;
			playlistsTemp.push(...res.data.playlists.items);
			console.log(`batch ${batchNum}`);
			console.log(res);
			batchNum++;
		} while (nextLink && playlistsTemp.length < 100);
		setOffset(offset + playlistsTemp.length);
		// Sort and filter
		playlistsTemp = nameFilter(playlistsTemp);
		console.log(playlistsTemp);
		let playlistsToShow = [];
		// Get user photos
		for (var i = 0; i < playlistsTemp.length; i++) {
			const playlist = playlistsTemp[i];
			console.log(i);
			const beans = await axios.get(
				`https://api.spotify.com/v1/users/${playlist.owner.id}`,
				{
					headers: {
						Authorization: "Bearer " + token,
						"Content-Type": "application/json",
					},
				}
			);
			console.log(beans);
			// If they have a picture, add them to the list
			if (beans.data.images.length > 0) {
				playlistsToShow.push({
					id: playlist.id,
					name: playlist.name,
					author: playlist.owner.display_name,
					image: beans.data.images[0].url,
				});
			}
		}

		setPlaylists(playlistsToShow);
		// user.log(`Retrieved ${res.data.items.length} playlists`);
	}

	const getPlaylistsForExport = async () => {
		let resultsArray = [];
		const idArray = JSON.parse(JSON.stringify(playlistsToKeep));
		for (var i = 0; i < idArray.length; i++) {
			const playlistId = idArray[i];
			console.log(playlistId);
			try {
				let res;
				// Remove old tracks
				const apiURL = `https://api.spotify.com/v1/playlists/${playlistId}`;
				res = await axios.get(apiURL, {
					headers: {
						Authorization: "Bearer " + token,
						"Content-Type": "application/json",
					},
				});

				if (res.status === 200) {
					console.log("got data", res.data.name);
					let d = res.data;
					// Playlist Name, Playlist Link, Creator Name, Creator Link, Followers
					resultsArray[i] = [
						d.name,
						d.external_urls.spotify,
						d.owner.display_name,
						d.owner.external_urls.spotify,
						d.followers.total,
					];
				} else {
					console.log(`Getting data gave us an error. Not cool man.`);
				}
			} catch (err) {
				console.log(`Getting data gave us an error. Not cool man.`);
				console.log(err);
			}
		}
		console.log(`All done boss.`);

		for (var j = 0; j < resultsArray.length; j++) {
			resultsArray[j] = resultsArray[j].join(" ## ");
		}

		document.getElementById("copy-text").value = resultsArray.join("\n");
		return resultsArray.join("\n");
	};

	const resultCards = playlists.map((playlist) => (
		<div
			style={{
				width: 220,
				background: "#ccc",
				margin: 10,
				padding: 10,
				position: "relative",
			}}
			key={playlist.id}>
			<img
				src={playlist.image}
				alt="author"
				style={{ width: "100%" }}
				id={playlist.id}
				onClick={addToList}
			/>
			<p>
				<strong>{playlist.author}</strong>
			</p>
			<p>{playlist.name}</p>
		</div>
	));

	const playlistsToKeepElements = playlistsToKeep.map((id) => (
		<li key={id}>{id}</li>
	));

	return (
		<Container fixed style={{ marginTop: 50 }}>
			<div style={{ textAlign: "center" }}>
				<TextField
					id="outlined-basic"
					label="Spotify Search Term"
					variant="outlined"
					style={{ width: "50%", marginBottom: 20 }}
					onChange={handleChange}
					onKeyDown={_handleKeyDown}
				/>{" "}
				<br />
			</div>
			<div
				style={{
					background: "green",
					display: "flex",
					flexDirection: "row",
					flexWrap: "wrap",
					borderRadius: 20,
					marginTop: 20,
				}}>
				{resultCards}
			</div>
			<br />
			<Button
				variant="contained"
				color="primary"
				onClick={() => searchTime()}>
				Get 100 more
			</Button>
			<h3>Playlists you're exporting</h3>
			<ol>{playlistsToKeepElements}</ol>
			<br />
			<Button
				variant="contained"
				color="primary"
				onClick={() => getPlaylistsForExport()}>
				Generate Copy Text
			</Button>
			<h3>Copy Text</h3>
			<textarea id="copy-text">{"beans\nbeans"}</textarea>
		</Container>
	);
};

export default SearchPage;
