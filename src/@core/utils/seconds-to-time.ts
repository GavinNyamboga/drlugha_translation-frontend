export function secondsToHms(e) {
	const h = Math.floor(e / 3600).toString().padStart(2,"0"),
		m = Math.floor(e % 3600 / 60).toString().padStart(2,"0"),
		s = Math.floor(e % 60).toString().padStart(2,"0");

	let timeString = "";

	if (h !== "00") {
		timeString += `${h}:`;
	}

	timeString += `${m}:${s}`;

	return timeString;
}
