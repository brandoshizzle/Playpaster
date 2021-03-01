import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import axios from "axios";
import { nameFilter, previousFilter } from "./filters";
import { songDetails, artistFlavour } from "./songs";

const defaultSmallMessage = `Hello {first name},

My name is {your first name} and I'm with a group called Little Symphony Records. We help emerging artists get their music off the page and into peoples ears!

I came across your playlist "{playlist name}", and I was wondering if you'd consider adding a song to it? {artist flavour text} I think they would be a good fit! (Song link below)

Being added to your playlist could be a game changer for {artist name}!

Thanks for reading this, and keep having such good taste in music,

{your first name}

{song link}`;

const defaultBigMessage = `Hello {first name},

My name is {your first name} and I'm with a group called Little Symphony Records. We help emerging artists get their music off the page and into peoples ears!

I came across your playlist "{playlist name}", and I was wondering if you'd consider adding a song to it? {artist flavour text} I think they would be a good fit! (Song link below)

Being added to your playlist could be a game changer for {artist name},

Thanks for reading this, and keep having such good taste in music.

{your first name}

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
	const [song, setSong] = useState(
		localStorage.getItem("songName") || "Ikigai"
	);

	let tooFewFollowersList = [];

	useEffect(() => {
		console.log(token);
		document.getElementById("message-small").value =
			localStorage.getItem("message-small") || defaultSmallMessage;
		document.getElementById("message-big").value =
			localStorage.getItem("message-big") || defaultBigMessage;
		document.getElementById("user-name").value =
			localStorage.getItem("userName") || "";
		tooFewFollowersList = localStorage.getItem("tooFewFollowersList") || [];
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
		// Get owners link text, parse it, and save it to local storage
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
		// Save username, song name, and song link to local storage
		localStorage.setItem(
			"userName",
			document.getElementById("user-name").value
		);
		localStorage.setItem("songName", song);
	}

	// Take a Spotify search query, filter out results, and present what's left
	async function searchTime() {
		console.log(searchTerm);
		let playlistsTemp = [];
		let nextLink;
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
		playlistsTemp = previousFilter(playlistsTemp, tooFewFollowersList);
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
	}

	// When you click on a playlist result, search for followers and add it to the list to search on FB
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
				} else {
					tooFewFollowersList.push(playlistID);
				}
			} else {
				setAlertOpen("block");
			}
		} catch (e) {
			setAlertOpen("block");
		}
	};

	const copyMessage = (info) => {
		const copyText = document.getElementById("message-small").value;
		const songDeets = songDetails.filter((obj) => obj.name === song)[0];
		// Replace all elements
		const text = copyText
			.replaceAll("{first name}", info.owner.split(" ")[0])
			.replaceAll("{playlist name}", info.name)
			.replaceAll("{song name}", songDeets.name)
			.replaceAll("{song link}", songDeets.link)
			.replaceAll("{artist name}", songDeets.artist)
			.replaceAll(
				"{artist flavour text}",
				artistFlavour[songDeets.artist]
			)
			.replaceAll(
				"{your first name}",
				document.getElementById("user-name").value.split(" ")[0]
			);

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
		localStorage.setItem(
			"tooFewFollowersList",
			JSON.stringify(tooFewFollowersList)
		);
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
					<td>{song.name}</td>
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
				alt="FB pic not loading - click to view"
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
			<a href={info.image} target="_blank" rel="noopener noreferrer">
				<img
					src={info.image}
					width={100}
					alt="FB pic not loading - click to view"
				/>
			</a>

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
						disabled={
							JSON.parse(
								localStorage.getItem("previousOwners")
							).indexOf(info.ownerId) > -1
								? true
								: false
						}
					/>{" "}
					Messaged them
				</label>
			</div>
		</div>
	));

	const songDropdownOptions = songDetails.map((song) => (
		<MenuItem value={song.name} key={song.name}>
			{song.artist} - {song.name}
		</MenuItem>
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
				label="Your Name (ex. Brandon Cathcart)"
				variant="outlined"
				style={{ width: "50%", marginBottom: 20 }}
			/>
			<br />
			<FormControl style={{ minWidth: 120, width: "50%" }}>
				<InputLabel id="song-dropdown-label">Song</InputLabel>
				<Select
					labelId="song-dropdown-label"
					id="demo-simple-select"
					variant="outlined"
					value={song}
					label="Song to Promote"
					onChange={(event) => {
						setSong(event.target.value);
					}}>
					{songDropdownOptions}
				</Select>
			</FormControl>
			<br />
			<TextField
				id="flavour-text"
				label="Artist flavour text"
				variant="outlined"
				value={
					artistFlavour[
						songDetails.filter((obj) => obj.name === song)[0]
							.artist || ""
					]
				}
				style={{ width: "100%", marginBottom: 20, marginTop: 20 }}
			/>
			<br />
			<TextField
				id="previous-playlists"
				label="Playlist URLs from spreadsheet"
				variant="outlined"
				style={{ width: "50%", marginBottom: 20 }}
			/>
			<TextField
				id="previous-owners"
				label="Owner URLs from spreadsheet"
				variant="outlined"
				style={{ width: "50%", marginBottom: 20 }}
			/>
			<br />
			<Button
				variant="contained"
				color="primary"
				onClick={() => previousPicksToArray()}>
				Save Setup
			</Button>
			<h3>2. Make sure the message looks good</h3>
			<TextField
				style={{ width: "50%", minHeight: 300 }}
				label="Small playlist message"
				variant="outlined"
				multiline
				id="message-small"
			/>
			<TextField
				style={{ width: "50%", minHeight: 300 }}
				label="Large playlist message"
				variant="outlined"
				multiline
				id="message-big"
			/>
			<Button
				variant="contained"
				color="primary"
				style={{ marginTop: 20, marginRight: 10 }}
				onClick={() => {
					localStorage.setItem(
						"message-small",
						document.getElementById("message-small").value
					);
					localStorage.setItem(
						"message-big",
						document.getElementById("message-big").value
					);
				}}>
				Save Messages
			</Button>
			<Button
				variant="contained"
				color="primary"
				style={{ marginTop: 20 }}
				onClick={() => {
					copyMessage({
						name: "Test Playlist",
						owner: "Beans McGee",
					});
				}}>
				Test Copy Message
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
