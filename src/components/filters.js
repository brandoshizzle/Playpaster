export function nameFilter(playlists) {
	let nameOnes = [];
	let others = [];
	for (var i = 0; i < playlists.length; i++) {
		const playlist = playlists[i];
		const name = playlist.owner.display_name;
		// Test for name to be two parts like a name
		// let twoParts = false;
		if (name === "Spotify") {
			continue;
		}
		if (name.indexOf(" ") > -1) {
			nameOnes.push(playlist);
		} else if ((name.match(/./g) || []).length === 1) {
			playlist.owner.display_name = name.split(".").join(" ");
			nameOnes.push(playlist);
		} else {
			others.push(playlist);
		}
	}

	// return [...nameOnes, ...others];
	return nameOnes;
}

export function previousFilter(playlists) {
	const previousPlaylistIds = localStorage.getItem("previousPlaylists");
	const goodOnes = [];
	if (!previousPlaylistIds) {
		return playlists;
	}
	for (var i = 0; i < playlists.length; i++) {
		if (previousPlaylistIds.indexOf(playlists[i].id) === -1) {
			goodOnes.push(playlists[i]);
		}
	}
	return goodOnes;
}
