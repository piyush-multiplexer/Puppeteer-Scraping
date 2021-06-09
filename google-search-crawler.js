module.exports = {
    async createTask(cluster) {
        return await cluster.task(async ({page, data}) => {
            const {searchTerm, offset} = data;
            await page.goto(
                'https://www.google.com/search?q=' + searchTerm + '&start=' + offset,
                {waitUntil: 'domcontentloaded'}
            );

            console.log('Extracting Google results for offset=' + offset + searchTerm);

            return (await page.evaluate(() => {
                    return [...document.querySelectorAll('#rso .g > div > div > div.yuRUbf > a')]
                        .map(el => ({url: el.href, name: el.childNodes[1]?.innerText}));
                })
            )
        });
    }
}
