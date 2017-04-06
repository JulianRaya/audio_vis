
$(function(){

	var rand = function (from, to) {
		var answer = Math.random() * (to - from) + from;
		return answer;
	};

	var constants = {};

	$.extend(true, window.app, {
		density: 0,//Math.round(rand(4000, 5000)),
		scale: 0,//rand(0.2, 0.7),
		rotation: 0,//rand(-1, 1),
		frequency:0,// rand(-30, 30),
		amplitude:0,// rand(-1, 1),
		numFrames: 7,
		maxClones: 10000,
		fps: 30,
		srcBase: "audio_vis/images/ralf/ralf00",
		ext: '.png',
		firstFrame: 51,
		screenW: 0,
		screenH: 0,
		imgW: 0,
		imgH: 0,
		bass: 0,
		images: [],
		animFunctions: [null, null]
	});

	app.canvas = $('#canvas1')[0];
	app.gContext = app.canvas.getContext('2d');
	app.msPerFrame = 1000 / app.fps;
	app.msTotal = app.msPerFrame * app.numFrames;

	requestAnimationFrame(function replay(now) {
		if (app.animFunctions[1] !== null) app.animFunctions[1].call(this, now);
		if (app.animFunctions[0] !== null) app.animFunctions[0].call(this, now);

		requestAnimationFrame(replay);
	});

	window.app = app;
});
