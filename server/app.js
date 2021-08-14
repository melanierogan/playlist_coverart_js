const express = require('express');
const handlebars = require('express-handlebars');
const runJimp = require('./jimp');
const multer = require('multer');
const path = require('path');

const bodyParserMiddleware = require('body-parser');

const app = new express();
const imageStorage = multer.diskStorage({
	// Destination to store image
	destination: 'images',
	filename: (req, file, cb) => {
		cb(
			null,
			file.fieldname + '_' + Date.now() + path.extname(file.originalname),
		);
		// file.fieldname is name of the field (image)
		// path.extname get the uploaded file extension
	},
});
const imageUpload = multer({
	storage: imageStorage,
	limits: {
		fileSize: 1000000, // 1000000 Bytes = 1 MB
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(png|jpeg)$/)) {
			// upload only png and jpg format
			return cb(new Error('Please upload a Image'));
		}
		cb(undefined, true);
	},
});
app.use(bodyParserMiddleware.json());
app.use(
	bodyParserMiddleware.urlencoded({
		// to support URL-encoded bodies
		extended: true,
	}),
);
const handlebarsInstance = handlebars.create({
	extname: '.html',
	defaultLayout: 'main',
});
app.engine('html', handlebarsInstance.engine);
app.set('views', __dirname + '/views/');
app.set('view engine', '.html');
app.use(express.static('public'));
app.use('/images', express.static('static'));

app.get('/', (req, res) => {
	res.render('index', {
		name: 'Home',
	});
});
app.post('/test', function(req, res, next) {
	console.log('start!');
	runJimp(req, res, next);
	console.log('end!');
	res.end('');
});
app.post('/playlist', async (req, res, next) => runJimp(req, res, next));

// @TODO Add routes
// Image Upload Routes
app.post('/image', imageUpload.single('image'), (req, res) => {
	res.send(req.file);
});
// Image Get Routes
app.get('/image/:filename', (req, res) => {
	res.json('/image/:filename api');
});

// app.listen(3000)
const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log('\n App listening on port:', port, '\n');
});
