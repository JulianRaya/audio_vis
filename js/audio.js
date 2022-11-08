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
	console.log(aCtx);
	var $ctrlPanel = $('#ctrlPanel');

	function setupAudioNodes(buffer) {
		console.log('setupAudioNodes');	

		var audio = app.audioElement;
		var ana1 = app.analyser = (app.analyser || aCtx.createAnalyser());
		var ana2 = app.analyser2 = (app.analyser2 || aCtx.createAnalyser());

		/*var src = app.source = aCtx.createMediaElementSource(audio);
		*/
		var src = app.source = aCtx.createBufferSource();

		src.connect(ana2);
		ana2.connect(ana1);
		src.connect(aCtx.destination);

		src.buffer = buffer;

		if (!src.start) {
			src.start = src.noteOn //in old browsers use noteOn method
			src.stop = src.noteOff //in old browsers use noteOff method
		};

		src.start(0);
		/*app.audioElement.play();*/
		setAnimation();
	}

	function loadSong(file, file_name) {

		console.log('loadSong', file_name);
		if (app.audioElement) $(app.audioElement).remove();
		if (app.source) app.source.disconnect();

		let fr = new FileReader();
		fr.onload = function(e){
			console.log('onload file reader');
			var fileResult = e.target.result;
			var audioContext = app.aContext;

			if(audioContext == null){
				return;
			}

			console.log('decoding the audio');
			audioContext.decodeAudioData(fileResult, function(buffer){
				console.log('decode callback');
				setupAudioNodes(buffer);
			}, function(){
				console.error('decoding failed!');
			});
		};

		fr.onerror = function(){
			console.log('error reading file');
		};

		console.log('starting file read');
		fr.readAsArrayBuffer(file);

		return;

		app.animFunctions[1] = null;
		app.audioElement = $('<audio>').appendTo(document.body)[0];
		app.audioElement.controls = true;

		app.audioElement.src = url;
		console.log('checking can play');
		app.audioElement.addEventListener('canplay', function(e) {
			console.log('can play indeed');
			setupAudioNodes();
		}, false);

		app.audioElement.addEventListener('ended', function(e) {
			console.log('endedddd');
			loadSong(app.trackList[++app.trackNum]);
		}, false);

	}

	function setAnimation() {
		console.log('settinig animation function');
		app.animFunctions[1] = function() {
			console.log('in animation function')
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
			app.scale = bass * 0.6;
			app.bass = bass;
			app.treb = treb;
		};
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

	$('#fileInput').one('change', function(){
		var audioInput = this;
		var file = audioInput.files[0];
        var fileName = file.name;
                
		loadSong(file, fileName);
	})


});
