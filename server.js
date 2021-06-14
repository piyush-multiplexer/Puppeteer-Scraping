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

    app.listen(port, function () {
        console.log('Server started at http://localhost:' + port);
    });
})();
