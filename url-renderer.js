module.exports = {
    async task_urlRenderer(cluster) {
        return await cluster.task(async ({page, data}) => {
            const {url} = data;
            await page.goto(url, {waitUntil: 'domcontentloaded'});
            return (await page.content())
        });
    }
}
