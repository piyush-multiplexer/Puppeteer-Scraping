const ClusterManager = require("./ClusterManager");
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

(async () => {
    let ClusterObj = new ClusterManager()
    await ClusterObj.launchCluster()

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '/index.html'));
    });

    app.get('/news', function (req, res) {
        res.send('News')
    })

    app.get('/redirect-render', function (req, res) {
        res.send('Render')
    })

    app.get('/search-crawl', async function (req, res) {
        let result = await ClusterObj.addClusterTask('google-search-crawler', {
            searchTerm: req.query.search,
            offset: 10
        });
        await ClusterObj.closeCluster()
        res.send(result)
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
        console.log('Server started at http://localhost:' + port);
    });
})();
