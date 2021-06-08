const {Cluster} = require('puppeteer-cluster');
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;


app.listen(port);
console.log('Server started at http://localhost:' + port);

(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_BROWSER,
        maxConcurrency: 4,
    });

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '/index.html'));
    });
    app.get('/news', function (req, res) {
        res.send('News')
    })
    app.get('/redirect-render', function (req, res) {
        res.send('Render')
    })
    app.get('/search-crawl', function (req, res) {
        res.send('Search')
    })
    app.get('/', async function (req, res) { // expects URL to be given by ?url=...
        try {
            const resp = await cluster.execute(req.query.url);
            res.status(200).send(resp);
        } catch (err) {
            res.end('Error: ' + err.message);
        }
    });

    app.listen(port, function () {
        console.log('Server listening on port 3000.');
    });
})();
