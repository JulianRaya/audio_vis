$(function () {



	var $cvs = $(app.canvas);
	var $cvs2 = $('#canvas2');
	var $cvs3 = $('#canvas3');
	var $cvs4 = $('#canvas4');

	var cvs = app.canvas;
	var cvs2 = $cvs2[0];
	var cvs3 = $cvs3[0];
	var cvs4 = $cvs4[0];


	var ctx = app.gContext;
	var ctx2 = cvs2.getContext('2d');
	var ctx3 = cvs3.getContext('2d');
	var ctx4 = cvs4.getContext('2d');



	var $win = $(window);
	var $wrap = $('#wrapper');




	var winResize = (function winResize() {
		var winW = $win.width();
		var winH = $win.height();

		if (winW < winH) {
			//vertical
			$wrap.removeClass('horizontal').addClass('vertical');
			$wrap.css('top', '0');
			if ($wrap.width() >= 400) {
				$wrap.css('left', Math.floor((winW - $wrap.width()) / 2.1));
			} else {
				$wrap.css('left', '5%');
			}

		} else {
			//horizontal

			$wrap.removeClass('vertical').addClass('horizontal');
			$wrap.css('left', 0);

			if (winH >= 480) {
				console.log('greater than 400', winH)
				$wrap.height(400);
				$wrap.css('top', Math.floor((winH - 440) / 2));
			} else {
				console.log('lessThan 400')
				$wrap.css({
					top:'20px',
					height:winH - 80
				})
			}


		}

		//var $wrap.height() = $wrap.height();
		//var $wrap.width() = $wrap.width();

		if (winW < 550) {

		} else {

		}

		app.screenH = Math.floor(($wrap.height()) / 2);
		app.screenW = Math.floor($wrap.width() / 2);
		console.log(app.screenH, app.screenW)

		cvs.width = cvs2.width = cvs3.width = cvs4.width = app.screenW;
		cvs.height = cvs2.width = cvs3.width = cvs4.width = app.screenH;



		$cvs.css({ left: 0, top: 0});
		$cvs2.css({ left: app.screenW, top: 0});
		$cvs3.css({ left: 0, top: app.screenH});
		$cvs4.css({ left: app.screenW, top: app.screenH});

		return winResize;
	})();

	$(window).on('resize', winResize);

	var imagesLoaded = 0;

	var loadImage = function (index) {
		var image = app.images[index] = new Image();
		var src = app.srcBase + (index + app.firstFrame) + app.ext;
		image.onload = function () {
			if (++imagesLoaded == app.numFrames) allLoaded()
		};
		image.src = src;
	};


	var allLoaded = function () {
		app.imgH = app.images[0].height;
		app.imgW = app.images[0].width;
		app.animFunctions[0] = animationFunction
	};


	var trigs = [Math.tan , Math.cos, Math.sin];//, Math.cos];
	var lastMaster = 0;

	var animationFunction = function (now) {
		var masterFrame = Math.floor((now / app.msPerFrame) % app.numFrames);
		if (masterFrame != lastMaster) {

			app.imageData = ctx.getImageData(0, 0, app.screenW, app.screenH);

			cvs.width = app.screenW;
			cvs2.width = app.screenW;
			cvs3.width = app.screenW;
			cvs4.width = app.screenW;

			cvs.height = app.screenH;
			cvs2.height = app.screenH;
			cvs3.height = app.screenH;
			cvs4.height = app.screenH;



			var newImgData = ctx.createImageData(app.screenW, app.screenH);
			var imgData = app.imageData;
			for (var i = 0, len = imgData.data.length; i < len; i += 4) {
				newImgData.data[i + 0] = 0;//imgData.data[i+0] * 0.5;
				newImgData.data[i + 1] = 0;//imgData.data[i+1] * 0.5;
				newImgData.data[i + 2] = 0;//imgData.data[i+2] * 0.5;
				newImgData.data[i + 3] = imgData.data[i + 3] * (app.bass * 1.2);
			}
			ctx.putImageData(newImgData, 0, 0);

			var oneOrNeg = [-1,1];
			var x, y, angle, mirrorIndex, mult, width, height, freq, amp, yTrigFunction, frameNum, maxRatio, scale;
			for (var i = 0; i < app.density; i++) {

				frameNum = (masterFrame + i) % app.numFrames;
				yTrigFunction = trigs[i % trigs.length];
				mirrorIndex = i - (i % 2); // i or i-1
				mult = oneOrNeg[i % 2]; // 1 or -1
				maxRatio = app.maxClones / app.density;

				scale = app.scale;
				amp = (scale * app.screenH / 2) * app.amplitude * 1.5;
				freq = (1 / app.scale) * app.frequency;
				angle = (mirrorIndex * (app.rotation * maxRatio ) * mult) / (app.density/200);// * (Math.PI / 360) * 2;
				x = i / scale * app.screenW / app.density;

				if (mult == -1) x = app.screenW - x;

				y = 1 / scale * (amp * yTrigFunction((mirrorIndex * freq) / app.density)) + (app.screenH / 2);
				width = app.imgW * scale;
				height = app.imgH * scale;


				ctx.translate(x, y);
				ctx.rotate(angle);
				ctx.drawImage(app.images[frameNum], -(width / 2), 0, width, height);
				ctx.rotate(-angle);
				ctx.translate(-x, -y);
			}
			lastMaster = masterFrame;

			if (app.timeData) {
				ctx.beginPath();
				ctx.globalCompositeOperation = "xor";
				ctx.shadowColor = '#ffffff';
				ctx.shadowBlur = (/*(app.treb || 1 ) **/ (app.bass || 1));
				ctx.strokeStyle = "rgba(255,255,255,0.8)";

				ctx.lineWidth = ((app.treb) || 0.02) * (app.bass || 1) * 10;


				ctx.moveTo(0, app.screenH / 2);

				for (var i = app.analyser2.frequencyBinCount; i >= 0; i -= 3) {
					var lineX, lineY;

					lineX = ((app.analyser2.frequencyBinCount - i) / app.analyser2.frequencyBinCount) * app.screenW;
					lineY = ((app.timeData[app.analyser2.frequencyBinCount - i] / (256 * app.bass)) * (app.screenH)) - (app.screenH / (4 * app.bass));

					ctx.lineTo(lineX, lineY);
				}
				ctx.stroke();
				ctx.globalCompositeOperation = "source-over";
				ctx.closePath();
			}

			ctx3.save();
			ctx3.scale(1,-1);
			ctx3.drawImage(cvs, 0, -cvs.height);
			ctx3.restore();

			ctx2.save();
			ctx2.scale(-1, 1);
			ctx2.drawImage(cvs, -cvs.width, 0);
			ctx2.restore();

			ctx4.save();
			ctx4.scale(-1,-1);
			ctx4.drawImage(cvs, -cvs.width, -cvs.height);
			ctx4.restore();

		}
	};

	for (var i = 0; i < app.numFrames; loadImage(i++));

});