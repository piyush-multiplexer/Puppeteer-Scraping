const express = require('express');
const app = express();
const {Cluster} = require('puppeteer-cluster');

(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_BROWSER, maxConcurrency: 4,
    });

    await cluster.task(async ({page, data: url}) => {
        await page.goto(url), {waitUntil: 'domcontentloaded'};
        return await page.content();
    });

    // setup server
    app.get('/', async (req, res) => { // expects URL to be given by ?url=...
        try {
            const resp = await cluster.execute(req.query.url);
            res.status(200).send(resp);
        } catch (err) {
            res.end('Error: ' + err.message);
        }
    });

    app.listen(3000, function () {
        console.log('Server listening on port 3000.');
    });
})();
