const express = require('express');
const handlebars = require('express-handlebars');
const runJimp = require('./jimp');

const bodyParserMiddleware = require('body-parser');

const app = new express();
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

// app.listen(3000)
const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log('\n App listening on port:', port, '\n');
});
