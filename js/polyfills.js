(function () {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length; ++x) {
		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}
		if(!window.AudioContext) {
			window.AudioContext = window[vendors[x] + "AudioContext"];
		}
		if(!window.OfflineAudioContext) {
			window.OfflineAudioContext = window[vendors[x] + "OfflineAudioContext"];
		}
	}
	if (!window.requestAnimationFrame)window.requestAnimationFrame = function (callback, element) {
		var currTime = new Date().getTime();
		var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		var id = window.setTimeout(function () {
			callback(currTime + timeToCall);
		}, timeToCall);
		lastTime = currTime + timeToCall;
		return id;
	};
	if (!window.cancelAnimationFrame)window.cancelAnimationFrame = function (id) {
		clearTimeout(id);
	};
}());
