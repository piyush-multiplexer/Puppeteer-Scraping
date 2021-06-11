module.exports = {
    async task_getTodaysHeadlines(cluster) {
        return await cluster.task(async ({page}) => {
            await page.goto('https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFZxYUdjU0FtVnVHZ0pKVGlnQVAB?hl=en-IN&gl=IN&ceid=IN%3Aen', {waitUntil: 'domcontentloaded'})
            await page.waitForSelector('c-wiz.MNK4Vd')
            return (await page.evaluate(() => {
                    let articles = document.querySelectorAll('a.DY5T1d')
                    let images = document.querySelectorAll('img.tvs3Id.QwxBBf')
                    let artTmp = []
                    let imgTmp = []
                    images.forEach(img => {
                            imgTmp.push(img.getAttribute('src'))
                        }
                    )
                    for (let i = 0; i < articles.length; i++) {
                        artTmp.push({
                            href: 'https://news.google.com' + articles[i].getAttribute('href').substring(1),
                            title: articles[i].innerText
                        })
                    }
                    return {articles: artTmp, images: imgTmp}
                })
            )
        });
    }
}

