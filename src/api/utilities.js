import { user, addPlaylist } from "../store";
import axios from "axios";

// Get information from album on Spotify
export async function getAlbumTracksFromSpotify(albumId) {
	// Make request
	let res = await axios.get(
		`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`,
		{
			headers: {
				Authorization: "Bearer " + user.token,
			},
		}
	);
	if (res.status === 200) {
		// We're all good, pick and choose data to include
		let trackData = [];
		for (var i = 0; i < res.data.items.length; i++) {
			const s = res.data.items[i];
			trackData[i] = {
				duration: s.duration_ms,
				id: s.id,
				trackNumber: s.track_number,
				name: s.name,
				uri: s.uri,
			};
		}
		return trackData;
	} else {
		// Error, set message and send empty response
		user.log(`Error in getting album id ${albumId}: ${res.error}`);
	}
}

// Gets all LS albums from Spotify
// If we already have detailed data, don't call it again
// If we don't, get detailed data from Spotify and add it
export async function getUserAlbumsFromSpotify() {
	let nextLink;
	user.log("Getting LS albums...");
	do {
		let res = await axios.get(
			nextLink ||
				"https://api.spotify.com/v1/artists/4SCWiQbJCMTHK737aNUqBJ/albums?offset=0&limit=50&market=CA",
			{
				headers: {
					Authorization: "Bearer " + user.token,
				},
			}
		);
		const albums = res.data.items;
		// We have all the albums.
		// Get track data for those who are new
		for (var i = 0; i < albums.length; i++) {
			let album = albums[i];
			if (!user.allAlbums.hasOwnProperty(album.id)) {
				const trackInfo = await getAlbumTracksFromSpotify(album.id);
				album = {
					...album,
					tracks: trackInfo,
				};
				user.allAlbums[album.id] = album;
			}
		}

		nextLink = res.data.next;
	} while (nextLink);

	user.log(`Loaded ${Object.values(user.allAlbums).length} albums`);
}

export function spotifyHeader() {
	return {
		Authorization: "Bearer " + user.token,
		"Content-Type": "application/json",
	};
}

export async function getPlaylistFromSpotify(id) {
	let nextLink;
	let listOfTracks = [];
	let hasLSAlbum = false;
	let playlistData;

	// Grab playlist from Spotify
	let res = await axios.get(
		nextLink || `https://api.spotify.com/v1/playlists/${id}`,
		{
			headers: spotifyHeader(),
		}
	);

	if (res.status === 200) {
		// Set all the basic info
		const p = res.data;
		playlistData = {
			id: p.id,
			name: p.name,
			url: p.external_urls.spotify,
			tracks_endpoint: p.tracks.href,
			description: decodeURIComponent(p.description),
			tracks: [],
			albums: [],
			albumsString: "",
			lastUpdated: Date.parse("1980-01-01T12:00:00Z"),
			duration: 0,
		};

		// Get all tracks on the playlist
		do {
			let data = res.data.tracks ? res.data.tracks : res.data;
			let trackBatch = data.items;
			listOfTracks = listOfTracks.concat(trackBatch);
			// Check if at least one track has LS album on it
			for (const trackData of trackBatch) {
				if (trackData.track.artists[0].name === "Little Symphony") {
					hasLSAlbum = true;
					break;
				}
			}
			nextLink = data.next;
			// If there's more, get the next batch
			if (nextLink) {
				res = await axios.get(nextLink, {
					headers: spotifyHeader(),
				});
			}
		} while (nextLink && hasLSAlbum);

		// No LS releases and more than 0 tracks? Send back default data
		if (!hasLSAlbum && listOfTracks.length > 0) {
			playlistData.tracks = undefined;
			return playlistData;
		}

		// Loop through tracks to get info
		for (const i in listOfTracks) {
			const track = listOfTracks[i].track;
			// Push relevant info to playlistData
			playlistData.tracks.push({
				place: i,
				id: track.id,
				uri: track.uri,
				duration: track.duration_ms,
				album: track.album.name,
			});

			playlistData.duration += track.duration_ms;
			const trackAddedDate = Date.parse(listOfTracks[i].added_at);

			// Updated lastUpdated if trackAddedDate is later
			playlistData.lastUpdated = Math.max.apply(null, [
				trackAddedDate,
				playlistData.lastUpdated,
			]);

			// If this is the first track of a new album on the playlist, add it to the lists
			if (playlistData.albumsString.indexOf(track.album.name) === -1) {
				playlistData.albums.push({
					id: track.album.id,
					name: track.album.name,
				});
				playlistData.albumsString += track.album.name + ", ";
			}
		}

		// Remove comma/space from album list
		playlistData.albumsString = playlistData.albumsString.slice(0, -2);

		return playlistData;
	}
}
