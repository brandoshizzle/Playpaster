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
		} else {
			others.push(playlist);
		}
	}

	return [...nameOnes, ...others];
}
