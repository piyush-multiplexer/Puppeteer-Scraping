const {Cluster} = require('puppeteer-cluster');
const puppeteer = require('puppeteer-core');
const {task_searchAndCrawl} = require('./google-search-crawler')
const {task_getTodaysHeadlines} = require('./google-news-headlines')
const {task_urlRenderer} = require('./url-renderer')

module.exports = class ClusterManager {
    constructor() {
        this.cluster = null
        console.log('Initiate Cluster')
    }

    async launchCluster() {
        this.cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_CONTEXT, puppeteer,
            puppeteerOptions: {executablePath: '/usr/bin/google-chrome-stable'},
            maxConcurrency: 3,
            args: ['--disable-web-security', '--disable-features=IsolateOrigins', ' --disable-site-isolation-trials']
        });
    }

    async addClusterTask(taskName, taskObj) {
        if (taskName === 'google-search-crawler') {
            await task_searchAndCrawl(this.cluster)
            return await this.cluster.execute(taskObj)
        } else if (taskName === 'news') {
            await task_getTodaysHeadlines(this.cluster)
            return await this.cluster.execute()
        } else if (taskName === 'url-renderer') {
            await task_urlRenderer(this.cluster)
            return await this.cluster.execute(taskObj)
        }
        return []
    }

    async closeCluster() {
        await this.cluster.idle()
    }
}
