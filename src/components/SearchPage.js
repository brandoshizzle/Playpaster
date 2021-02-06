import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { nameFilter, previousFilter } from "./filters";

const defaultMessage = `Hey {first name},
I stumbled on your {playlist name} playlist on Spotify (if it actually is your playlist) and I really enjoy it!

A friend of mine, an aspiring instrumental pianist from Edmonton, Canada, recently released a new single that may fit nicely on your playlist! If you want to check it out, it’s called {song name}, a link is below.

Thanks for reading my message and keep up your great taste in music! Sorry for the unsolicited message, but I hope you enjoy the music and have a wonderful day!

Tyler

{song link}`;

const SearchPage = (props) => {
	let { token } = props;
	const [searchTerm, setSearchTerm] = useState("");
	const [playlists, setPlaylists] = useState([]);
	const [offset, setOffset] = useState(0);
	const [playlistsToKeep, setPlaylistsToKeep] = useState([]);
	const [alertOpen, setAlertOpen] = useState("none");
	const [badNameCount, setBadNameCount] = useState(0);
	const [alreadyGotItCount, setAlreadyGotItCount] = useState(0);
	const [searchTotal, setSearchTotal] = useState(0);
	const [resultsTableRows, setResultsTableRows] = useState([]);
	const [noPicCount, setNoPicCount] = useState(0);

	useEffect(() => {
		console.log(token);
		document.getElementById("message").value =
			localStorage.getItem("message") || defaultMessage;
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

	function previousPicksToArray() {
		// Get playlist link text, parse it, and save it to local storage
		let playlistsText = document.getElementById("previous-playlists").value;
		let firstHTTP = playlistsText.indexOf("https");
		playlistsText = playlistsText.substring(firstHTTP);
		let previousPlaylistIdArray = playlistsText.split(" ");
		previousPlaylistIdArray = previousPlaylistIdArray.map((val, i) => {
			const lastSlash = val.lastIndexOf("/");
			return val.substring(lastSlash + 1);
		});
		localStorage.setItem(
			"previousPlaylists",
			JSON.stringify(previousPlaylistIdArray)
		);
		// Get playlist link text, parse it, and save it to local storage
		let ownersText = document.getElementById("previous-owners").value;
		firstHTTP = ownersText.indexOf("https");
		ownersText = ownersText.substring(firstHTTP);
		let previousOwnerIdArray = ownersText.split(" ");
		previousOwnerIdArray = previousOwnerIdArray.map((val, i) => {
			const lastSlash = val.lastIndexOf("/");
			return val.substring(lastSlash + 1);
		});
		localStorage.setItem(
			"previousOwners",
			JSON.stringify(previousOwnerIdArray)
		);
	}

	async function searchTime() {
		console.log(searchTerm);
		let playlistsTemp = [];
		let nextLink;
		let batchNum = 1;
		try {
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
				console.log(res);
				batchNum++;
				setSearchTotal(res.data.playlists.total);
			} while (nextLink && playlistsTemp.length < 100);
		} catch (e) {
			setAlertOpen("block");
		}
		const newOffset = offset + playlistsTemp.length;
		setOffset(newOffset);
		// Sort and filter
		const batchSize = playlistsTemp.length;
		console.log(batchSize);
		playlistsTemp = nameFilter(playlistsTemp);
		const nameFilterCount = batchSize - playlistsTemp.length;
		console.log(nameFilterCount);
		setBadNameCount(nameFilterCount);
		playlistsTemp = previousFilter(playlistsTemp);
		const previousFilterCount =
			batchSize - nameFilterCount - playlistsTemp.length;
		console.log(previousFilterCount);
		setAlreadyGotItCount(previousFilterCount);
		let playlistsToShow = [];
		let noPicCountTemp = 0;
		// Get user photos
		for (var i = 0; i < playlistsTemp.length; i++) {
			const playlist = playlistsTemp[i];
			console.log(i);
			let beans;
			try {
				beans = await axios.get(
					`https://api.spotify.com/v1/users/${playlist.owner.id}`,
					{
						headers: {
							Authorization: "Bearer " + token,
							"Content-Type": "application/json",
						},
					}
				);
			} catch (e) {
				continue;
			}
			// If they have a picture, add them to the list
			if (beans.data.images.length > 0) {
				playlistsToShow.push({
					id: playlist.id,
					name: playlist.name,
					owner: playlist.owner.display_name,
					ownerId: playlist.owner.id,
					image: beans.data.images[0].url,
				});
			} else {
				noPicCountTemp++;
			}
		}
		setNoPicCount(noPicCountTemp);
		setPlaylists(playlistsToShow);
		// user.log(`Retrieved ${res.data.items.length} playlists`);
	}

	const addToList = async (e) => {
		const playlistID = e.target.id;
		const playlistInfo = playlists.find((x) => x.id === playlistID);
		let newPlaylist = [];
		document.getElementById(e.target.id).parentElement.style.opacity = 0.2;
		try {
			let res;
			const apiURL = `https://api.spotify.com/v1/playlists/${playlistID}`;
			res = await axios.get(apiURL, {
				headers: {
					Authorization: "Bearer " + token,
					"Content-Type": "application/json",
				},
			});

			if (res.status === 200) {
				console.log("got data", res.data.name);
				let d = res.data;
				if (d.followers.total > 3) {
					newPlaylist = {
						...playlistInfo,
						playlist_url: d.external_urls.spotify,
						owner_url: d.owner.external_urls.spotify,
						followers: d.followers.total,
					};
					setPlaylistsToKeep([...playlistsToKeep, newPlaylist]);
				}
			} else {
				setAlertOpen("block");
			}
		} catch (e) {
			setAlertOpen("block");
		}
	};

	const copyMessage = (info) => {
		const copyText = document.getElementById("message").value;
		const songName = document.getElementById("song-name").value;
		const songLink = document.getElementById("song-link").value;
		// Replace all elements
		const text = copyText
			.replace("{first name}", info.owner.split(" ")[0])
			.replace("{playlist name}", info.name)
			.replace("{song name}", songName)
			.replace("{song link}", songLink);

		var textArea = document.createElement("textarea");
		textArea.style.position = "fixed";
		textArea.style.top = 0;
		textArea.style.left = 0;
		textArea.style.width = "2em";
		textArea.style.height = "2em";
		textArea.style.padding = 0;
		textArea.style.border = "none";
		textArea.style.outline = "none";
		textArea.style.boxShadow = "none";
		textArea.style.background = "transparent";
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		try {
			var successful = document.execCommand("copy");
			var msg = successful ? "successful" : "unsuccessful";
			console.log("Copying text command was " + msg);
		} catch (err) {
			console.log("Oops, unable to copy");
		}

		document.body.removeChild(textArea);
	};

	const getPlaylistsForExport = async () => {
		let resultsArray = [];
		const playlistArray = JSON.parse(JSON.stringify(playlistsToKeep));
		for (var i = 0; i < playlistArray.length; i++) {
			const playlist = playlistArray[i];
			// Playlist Name, Playlist Link, Creator Name, Creator Link, Followers, Song, Search Term, FB Link, nothing, attacked (yee), attacked by (inits), nothing, date
			resultsArray[i] = (
				<tr key={i}>
					<td>{playlist.name}</td>
					<td>{playlist.playlist_url}</td>
					<td>{playlist.owner}</td>
					<td>{playlist.owner_url}</td>
					<td>{playlist.followers}</td>
					<td>{document.getElementById("song-name").value}</td>
					<td>{searchTerm}</td>
					<td>
						{document.getElementById(`fblink-${playlist.id}`)
							.value || "nay"}
					</td>
					<td>{""}</td>
					<td>
						{document.getElementById(`messaged-${playlist.id}`)
							.checked
							? "yee"
							: "nay"}
					</td>
					<td>
						{document.getElementById(`messaged-${playlist.id}`)
							.checked
							? document.getElementById("user-name").value
							: ""}
					</td>
					<td>{""}</td>
					<td>
						{document.getElementById(`messaged-${playlist.id}`)
							.checked
							? new Date(Date.now()).toLocaleDateString()
							: ""}
					</td>
				</tr>
			);
		}

		setResultsTableRows(resultsArray);
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
				alt="owner"
				style={{ width: "100%" }}
				id={playlist.id}
				onClick={addToList}
			/>
			<p>
				<strong>{playlist.owner}</strong>
			</p>
			<p>{playlist.name}</p>
		</div>
	));

	const playlistsToKeepElements = playlistsToKeep.map((info) => (
		<div
			key={info.id}
			style={{
				display: "flex",
				flexDirection: "row",
				width: "100%",
				margin: 10,
			}}>
			<img src={info.image} width={100} alt="pic" />
			<div style={{ width: "40%" }}>
				<h3 style={{ margin: 2, padding: 5 }}>{info.owner}</h3>
				<h4 style={{ margin: 2, padding: 5 }}>{info.name}</h4>
				<p style={{ margin: 2, padding: 5 }}>
					{info.followers} followers
				</p>
			</div>
			<div style={{ display: "flex" }}>
				<a
					href={`https://www.facebook.com/search/people/?q=${info.owner}`}
					style={{
						textDecoration: "none",
					}}
					target="_blank"
					rel="noopener noreferrer"
					onClick={() => copyMessage(info)}>
					<Button
						variant="contained"
						style={{ width: 210, marginTop: 8, marginRight: 5 }}
						color={
							JSON.parse(
								localStorage.getItem("previousOwners")
							).indexOf(info.ownerId) > -1
								? "default"
								: "primary"
						}>
						{JSON.parse(
							localStorage.getItem("previousOwners")
						).indexOf(info.ownerId) > -1
							? "Owner in database"
							: "Search on Facebook"}
					</Button>
				</a>
				{/* <br /> */}
				{/* <input placeholder={"Paste FB here"} id={`fblink-${info.id}`} /> */}
				<TextField
					style={{ flex: 1 }}
					label="Paste FB Here"
					variant="outlined"
					id={`fblink-${info.id}`}
				/>
				<br />

				<label>
					<input
						type="checkbox"
						id={`messaged-${info.id}`}
						name="messaged"
					/>{" "}
					Messaged them
				</label>
			</div>
		</div>
	));

	return (
		<Container fixed style={{ marginTop: 50 }}>
			<h3>1. Setup</h3>
			<Button
				variant="contained"
				color="primary"
				onClick={() => {
					localStorage.removeItem("token");
					window.location.reload();
				}}>
				Get Spotify token
			</Button>
			<br />
			<br />
			<TextField
				id="user-name"
				label="Your Initials"
				variant="outlined"
				style={{ width: "50%", marginBottom: 20 }}
			/>
			<br />
			<TextField
				id="song-name"
				label="Promoting Song Name"
				variant="outlined"
				style={{ width: "50%", marginBottom: 20 }}
			/>
			<TextField
				id="song-link"
				label="Promoting Song Link"
				variant="outlined"
				style={{ width: "50%", marginBottom: 20 }}
			/>
			<br />
			<TextField
				id="previous-playlists"
				label="Playlist links from spreadsheet"
				variant="outlined"
				style={{ width: "50%", marginBottom: 20 }}
			/>
			<TextField
				id="previous-owners"
				label="Playlist owners from spreadsheet"
				variant="outlined"
				style={{ width: "50%", marginBottom: 20 }}
			/>
			<br />
			<Button
				variant="contained"
				color="primary"
				onClick={() => previousPicksToArray()}>
				Process saved playlists
			</Button>
			<h3>2. Make sure the message looks good</h3>
			<TextField
				style={{ width: "100%", minHeight: 300 }}
				label="Message"
				variant="outlined"
				multiline
				id="message"
			/>
			<Button
				variant="contained"
				color="primary"
				onClick={() =>
					localStorage.setItem(
						"message",
						document.getElementById("message").value
					)
				}>
				Save
			</Button>
			<h3>3. Search for playlists on Spotify</h3>
			<div>
				<TextField
					id="outlined-basic"
					label="Spotify Search Term"
					variant="outlined"
					style={{ width: "50%", marginBottom: 20 }}
					onChange={handleChange}
					onKeyDown={_handleKeyDown}
				/>
				<br />
			</div>
			<div>
				<p style={{ display: offset > 0 ? "block" : "none" }}>
					Gathering 100 playlists out of {searchTotal}... Filtered{" "}
					{badNameCount} unlikely names... Filtered{" "}
					{alreadyGotItCount} previously logged playlists... Filtered{" "}
					{noPicCount} without profile pictures... Returning{" "}
					{playlists.length}.
				</p>
			</div>
			<h3>4. Pick promising playlists</h3>
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
			<h3>5. Find and message them on Facebook</h3>
			<ol>{playlistsToKeepElements}</ol>
			<br />

			<h3>6. Generate text to paste into the tracking spreadsheet</h3>
			<Button
				variant="contained"
				color="primary"
				onClick={() => getPlaylistsForExport()}>
				Generate Copy Text
			</Button>
			<br />
			<br />
			<table style={{ width: "100%", border: "2px solid black" }}>
				{resultsTableRows}
			</table>
			<div
				style={{
					position: "fixed",
					display: alertOpen,
					width: "100%",
					height: 50,
					background: "red",
					top: 0,
					left: 0,
					textAlign: "center",
				}}>
				<p style={{ color: "white" }}>
					Error with Spotify request - please get new Spotify token
					(step 1)
				</p>
			</div>
		</Container>
	);
};

export default SearchPage;
