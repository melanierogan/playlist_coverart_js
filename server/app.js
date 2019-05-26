const express = require('express')
const handlebars = require('express-handlebars');

const app = new express();

const handlebarsInstance = handlebars.create({ 
	extname: '.html',
	defaultLayout: 'main'

});
app.engine('html', handlebarsInstance.engine);
app.set('view engine', '.html');
app.use(express.static('public'));
app.use('/images', express.static('static'));
// app.get('/', function (req, res) {
//   res.send('Hello World')
// })

app.get('/', (req, res) => {
	res.render('layouts/home', {
		title: 'Home',
		pageTitle: 'Hello 👋' 
	});
});
 
// app.listen(3000)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('\n App listening on port:', port, '\n');
});