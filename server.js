const ClusterManager = require("./ClusterManager");
const express = require('express');
let cors = require('cors')
const path = require('path');

const app = express()
app.use(cors())
const port = process.env.PORT || 3000;

(async () => {
    let ClusterObj = new ClusterManager()
    await ClusterObj.launchCluster()

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '/index.html'));
    });

    app.get('/news', async function (req, res) {
        let result = await ClusterObj.addClusterTask('news')
        await ClusterObj.closeCluster()
        res.send(result)
    })

    app.get('/url-render', async function (req, res) {
        let result = await ClusterObj.addClusterTask('url-renderer', {url: req.query.url})
        await ClusterObj.closeCluster()
        res.send(result)
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
