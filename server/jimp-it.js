const Jimp = require('jimp');

const imgActive = 'server/static/images/active/image1.jpeg';
const imgExported = 'server/static/images/export/image1.jpeg';
let textData = {
	text: 'this is cool', //the text to be rendered on the image
	maxWidth: 1004, //image width - 10px margin left - 10px margin right
	maxHeight: 92, //text height + margin
	placementX: 10, // on the x axis
	placementY: 94, //bottom of the image
};

const runJimpIt = async res => {
	return (
		Promise.all([
			Jimp.read('server/static/images/active/image1.jpeg'),
			Jimp.loadFont(Jimp.FONT_SANS_128_BLACK),
		])
			.then((image, font) => {
				// Do stuff with the image.
				image.print(
					font,
					textData.placementX,
					textData.placementY,
					{
						text: textData.text,
						alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
					},
					textData.maxWidth,
				);
				return new Promise(resolve => {
					setTimeout(() => {
						resolve();
					}, 10000);
				});
			})

			// .then(image => {
			// 	// Do stuff with the image.
			// 	image.resize(256, 256);
			// })
			// .then(image => {
			// 	// Do stuff with the image.
			// 	image.write(imgExported);
			// })
			.catch(err => {
				// Handle an exception.
				console.log(err, 'there was an error');
			})
	);
};

module.exports = runJimpIt;
