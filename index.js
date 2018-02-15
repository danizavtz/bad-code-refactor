var express = require('express');
var app = express();

var bodyParser = require('body-parser');
const expressValidator = require('express-validator');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
			extended: true
}));
app.use(expressValidator());
app.use(require('./server/app'));

app.listen(3000, function() {
			console.log('Listening on http://localhost:3000');
});

//após tentar casar todas as rotas a ultima rota que sobrou é not found
app.get('*', function(req, res) {
			res.status(404).send('<html><head><style>body {font-family: Helvetica, Arial, Sans-Serif;margin-top: 5em;}h1 {font-size: 3em;}h2 {font-size: 2em}</style></head></body><center><h1>Página não encontrada</h1><center><h2>404 Not found</h2></center></body></html>');
});

module.exports = app;
