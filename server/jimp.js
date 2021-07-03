const Jimp = require('jimp');

const runJimp = async (req, res, next, uploaded_image) => {
	console.log('we jimping');
	try {
		console.log(req.body, 'this the body');
		if (!req.body || !req.body.playlist_title) {
			throw new Error('Missing a playlist title');
		}
		const imgActive =
			uploaded_image || 'server/static/images/active/image1.jpeg';
		const imgExported = 'server/static/images/export/image1.jpeg';
		const logo = 'server/static/images/logo.png';

		const textData = {
			text: `${req.body.playlist_title}`, //the text to be rendered on the image
			maxWidth: 1004, //image width - 10px margin left - 10px margin right
			maxHeight: 92, //logo height + margin
			x: 10, // 10px in on the x axis
			y: 924, //bottom of the image: height - maxHeight - margin
		};
		Jimp.read(imgActive)
			.then(image => {
				return image
					.resize(256, 256) // resize
					.quality(60) // set JPEG quality
					.greyscale() // set greyscale
					.mask(logo, 5)
					.quality(100);
			})
			.then(image => {
				Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => {
					image.print(font, 10, 10, textData.text).write(imgExported);
				});
			})
			.catch(error => {
				// Handle an exception.
				console.error(error);
			});
		console.log('done');
		res.status(200).json({
			status: 'Cover art has been generated',
		});
	} catch (error) {
		console.log(error);
		return { status: 400, status_text: 'Cover art not generated' };
	}
};

module.exports = runJimp;
