/**
 * @constructor
 * @struct
 * **/


$(function() {

	/**
	 * A new song object is created for each song
	 * @struct Song
	 *
	 * **/
	var audio = {};

	var aCtx = app.aContext = new AudioContext();
	var $ctrlPanel = $('#ctrlPanel');

	function setupAudioNodes() {
		var audio = app.audioElement;
		var ana1 = app.analyser = (app.analyser || aCtx.createAnalyser());
		var ana2 = app.analyser2 = (app.analyser2 || aCtx.createAnalyser());

		var src = app.source = aCtx.createMediaElementSource(audio);
		src.connect(ana2);
		ana2.connect(ana1);
		src.connect(aCtx.destination);

		app.audioElement.play();
		setAnimation();
	}

	function loadSong(url) {

		if (app.audioElement) $(app.audioElement).remove();
		if (app.source) app.source.disconnect();


		app.animFunctions[1] = null;
		app.audioElement = $('<audio>').appendTo(document.body).hide()[0];
		app.audioElement.controls = true;

		app.audioElement.src = url;
		app.audioElement.addEventListener('canplay', function(e) {
			setupAudioNodes();
		}, false);

		app.audioElement.addEventListener('ended', function(e) {
			loadSong(app.trackList[++app.trackNum]);
		}, false);

	}

	function setAnimation() {
		app.animFunctions[1] = function() {

			var fbc1 = app.analyser.frequencyBinCount - 128;
			var fbc2 = app.analyser2.frequencyBinCount;
			var frequencyData = new Uint8Array(fbc1);
			app.timeData = new Uint8Array(fbc2);

			app.analyser.getByteFrequencyData(frequencyData);
			app.analyser2.getByteTimeDomainData(app.timeData);

			var bassSum = 0, mid1Sum = 0, mid2Sum = 0, trebSum = 0;
			/*var validCount = ;*/

			/*for (var i = fbc2; i >= 0; i--) {
				if (!validCount && frequencyData[i] > 0) validCount = i;
			}*/
			var unit = Math.round(fbc1 / 4);

			for (var i = 0; i < unit; bassSum += frequencyData[i++]);
			for (var i = unit; i < 2 * unit; mid1Sum += frequencyData[i++]);
			for (var i = 2 * unit; i < 3 * unit; mid2Sum += frequencyData[i++]);
			for (var i = 3 * unit; i < fbc1; trebSum += frequencyData[i++]);

			var bass = (bassSum / (fbc1 / 4)) / 255;
			var mid1 = (mid1Sum / (fbc1 / 4)) / 255;
			var mid2 = (mid2Sum / (fbc1 / 4)) / 255;
			var treb = (trebSum / (fbc1 / 4)) / 255;

			app.frequency = -10 + (bass * mid2 * 90);
			app.amplitude = mid2 * 0.8;
			app.density = ((treb + mid1 + mid2 + bass) / 4) * 15000;
			app.rotation = treb * mid2;
			app.scale = bass * 0.4;
			app.bass = bass;
			app.treb = treb;
		};
	}


	var x = 1;
	if (x < 0) {
		function blast() {
			'use strict';

		}
	}

	/*
	$.getJSON('list', function(data){
		var bigList = data;
		app.files = bigList;
		app.artistList = bigList;
		var trackList = bigList['\Jimi Hendrix']['Axis Bold As Love'];
		app.trackNum = 0;//Math.floor(rand(0, trackList.length));
		app.trackList = trackList;
		loadSong(trackList[app.trackNum]);
	});
	*/

	$('body').on('click', function(){
		loadSong('mp3/komori.mp3');
	})


});
