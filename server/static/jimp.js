const Jimp = require('jimp');

const runJimp = async res => {
	try {
		//if you are following along, create the following 2 images relative to this script:
		const imgRaw = 'image1.png'; //a 1024px x 1024px background image
		const imgLogo = ''; //a 155px x 72px logo
		//---

		const imgActive = 'server/static/images/active/image1.jpeg';
		const imgExported = 'server/static/images/export/image1.jpeg';

		const textData = {
			text: 'playlist name', //the text to be rendered on the image
			maxWidth: 1004, //image width - 10px margin left - 10px margin right
			maxHeight: 92, //logo height + margin
			x: 10, // 10px in on the x axis
			y: 924, //bottom of the image: height - maxHeight - margin
		};
		let font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
		Jimp.read(imgActive)
			.then(Jimp.loadFont(Jimp.FONT_SANS_32_BLACK))
			.then(lenna => {
				return lenna
					.resize(256, 256) // resize
					.quality(60) // set JPEG quality
					.greyscale() // set greyscale
					.print(font => {
						lenna.print(
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
					}) // add copy
					.write(imgExported); // save
			})
			.catch(err => {
				// Handle an exception.
				console.error(err);
			});

		// //read template & clone raw image
		// Jimp.read(imgRaw)
		//   .then(tpl => (tpl.clone().write(imgActive)))

		//   //read cloned (active) image
		//   .then(() => (Jimp.read(imgActive)))

		//   //combine logo into image
		//   .then(tpl => (
		//     Jimp.read(imgLogo).then(logoTpl => {
		//       logoTpl.opacity(0.2);
		//       return tpl.composite(logoTpl, 512-75, 512, [Jimp.BLEND_DESTINATION_OVER, 0.2, 0.2]);
		//     });
		//   );

		//   //load font
		//   .then(tpl => (
		//     Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(font => ([tpl, font]))
		//   ))

		//   //add footer text
		//   .then(data => {

		//     tpl = data[0];
		//     font = data[1];

		//     return tpl.print(font, textData.placementX, textData.placementY, {
		//       text: textData.text,
		//       alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
		//       alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
		//     }, textData.maxWidth, textData.maxHeight);
		//   })

		//   //export image
		//   .then(tpl => (tpl.quality(100).write(imgExported)))

		//   //log exported filename
		//   .then(tpl => {
		//     console.log('exported file: ' + imgExported);
		//   })

		//   //catch errors
		//   .catch(err => {
		//     console.error(err);
		//   });
		console.log('done');
		return { status: 200, status_text: 'done' };
	} catch (error) {
		console.log(error);
		return { status: 400, status_text: 'not done' };
	}
};

module.exports = runJimp;
