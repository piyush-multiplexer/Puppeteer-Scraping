//Google News Headlines Scrapping
const puppeteer = require('puppeteer-core');

(async () => {
    let launchOptions = {headless: false, executablePath: '/usr/bin/google-chrome-stable'}
    const browser = await puppeteer.launch(launchOptions)
    const page = await browser.newPage()
    await page.setViewport({width: 1366, height: 768})
    await page.goto('https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFZxYUdjU0FtVnVHZ0pKVGlnQVAB?hl=en-IN&gl=IN&ceid=IN%3Aen')
    await page.waitForSelector('c-wiz.MNK4Vd')
    console.log('article')
    let news = await page.evaluate(() => {
        let docs = document.querySelectorAll('#yDmH0d > c-wiz > div > div.FVeGwb.CVnAc.Haq2Hf.bWfURe > div.ajwQHc.BL5WZb.RELBvb.zLBZs > div > main > c-wiz > div.lBwEZb.BL5WZb.xP6mwf > div:nth-child(4)')
        console.log(docs)
            let articles = document.querySelectorAll('a.DY5T1d')
            let images = document.querySelectorAll('img.tvs3Id.QwxBBf')
            console.log(images)
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
        }
    )
    console.log(news.articles.length, news.images.length)
    await browser.close()
})();
//webmd
