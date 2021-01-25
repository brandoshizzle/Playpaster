import { store } from "@risingstack/react-easy-state";
import { observe } from "@nx-js/observer-util";
import merge from "lodash/merge";

const defaultUser = {
	name: "",
	id: "",
	token: "",
	tokenms: 0,
	allPlaylists: [],
	filteredPlaylists: [],
	selectedAlbums: [],
	allAlbums: {},
	selectedPlaylists: [],
	progress: {
		done: 0,
		total: 0,
		percent: 0,
	},
	log: (newLine, color) => {
		const textColor = color || "normal";
		const colors = {
			start: "cornflowerblue",
			normal: "#ddd",
			end: "lightgreen",
			error: "red",
		};
		const logline = "> " + newLine;
		user.logArray.push({ text: logline, color: colors[textColor] });
		var logEl = document.getElementById("logger");
		logEl.scrollTop = logEl.scrollHeight + 50;
	},
	logArray: [],
	errors: [],
};

export function addPlaylist(playlistData) {
	user.allPlaylists.push({
		id: playlistData.id,
		name: playlistData.name,
		url: playlistData.external_urls.spotify,
		tracks_endpoint: playlistData.tracks.href,
		description: decodeURIComponent(playlistData.description),
		tracks: playlistData.tracks,
		albumsString: playlistData.albumsString,
		albums: playlistData.albums,
		lastUpdated: playlistData.lastUpdated,
		duration: playlistData.duration,
	});
}

export const user = store(
	localStorage.getItem("user") != null
		? merge(defaultUser, JSON.parse(localStorage.getItem("user")))
		: defaultUser
);

observe(() => {
	localStorage.setItem("user", JSON.stringify(user));
});

window.user = user;
