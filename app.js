const db = require('./models/index.js');

const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const urlShortener = require('node-url-shortener');

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded());

/*
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
*/

app.get('/', function(req, res) {
    db.Url.findAll({order: [['createdAt', 'DESC']], limit: 5})
    .then(urlObjs => {
      res.render('index', {
        urlObjs: urlObjs
      });
    });
  });


app.post('/url', function(req, res) {
  const url = req.body.url

  urlShortener.short(url, function(err, shortUrl){
    res.send(shortUrl);
  });
});

app.listen(port, () => console.log(`url-shortener listening on port ${port}!`));

app.post('/url', function(req, res) {
    const url = req.body.url
  
    urlShortener.short(url, function(err, shortUrl) {
      db.Url.findOrCreate({where: {url: url, shortUrl: shortUrl}})
      .then(([urlObj, created]) => {
        res.send(shortUrl)
      });
    });
  });

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
