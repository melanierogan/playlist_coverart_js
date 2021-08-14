const Jimp = require('jimp');

const runJimp = async (req, res, next) => {
	console.log('we jimping');
	try {
		console.log(req.body, 'this the body');
		if (!req.body) {
			throw new Error('Missing a playlist title');
		}
		let imgRaw = 'server/static/images/raw/image1.jpeg';
		let imgLogo = 'server/static/images/logo.png';
		const imgActive = 'server/static/images/active/image1.jpeg';
		const imgExported = 'server/static/images/export/image1.jpeg';

		const textData = {
			text: `${req.body.playlist_title}`, //the text to be rendered on the image
			maxWidth: 1000, //image width - 10px margin left - 10px margin right
			maxHeight: 52, //logo height + margin
			x: 0, // 10px in on the x axis
			y: 500, //bottom of the image: height - maxHeight - margin
		};
		//read template & clone raw image
		Jimp.read(imgRaw)
			.then(tpl => tpl.clone().write(imgActive))

			//read cloned (active) image
			.then(() => Jimp.read(imgActive))

			//combine logo into image
			.then(tpl =>
				Jimp.read(imgLogo).then(logoTpl => {
					// logoTpl.opacity(0.2);
					return tpl.composite(logoTpl, 360, 10, [
						Jimp.BLEND_DESTINATION_OVER,
						0.2,
						0.2,
					]);
				}),
			)

			//load font
			.then(tpl =>
				Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(font => [tpl, font]),
			)

			//add footer text
			.then(data => {
				tpl = data[0];
				font = data[1];

				return tpl.print(
					font,
					textData.x,
					textData.y,
					{
						text: textData.text,
						alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
						alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
					},
					textData.maxWidth,
					textData.maxHeight,
				);
			})

			//export image
			.then(tpl => tpl.quality(100).write(imgExported))

			//log exported filename
			.then(tpl => {
				console.log('exported file: ' + imgExported);
			})

			//catch errors
			.catch(err => {
				console.error(err);
			});
		// .then(image => {
		// 	return image
		// 		.resize(256, 256) // resize
		// 		.quality(60) // set JPEG quality
		// 		.greyscale() // set greyscale
		// 		.mask(logo, 5)
		// 		.quality(100);
		// })
		// .then(image => {
		// 	Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => {
		// 		image.print(font, 10, 10, textData.text).write(imgExported);
		// 	});
		// })
		// .catch(error => {
		// 	// Handle an exception.
		// 	console.error(error);
		// });
		console.log('done');
		res.status(200).json({
			status: 'Cover art has been generated',
		});
		res.end('');
	} catch (error) {
		console.log(error);
		res.status(400).json({
			status: 'cover art not generated',
		});
		res.end('');
	}
};

module.exports = runJimp;
