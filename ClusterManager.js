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
        await task_searchAndCrawl(this.cluster)
        await task_getTodaysHeadlines(this.cluster)
        await task_urlRenderer(this.cluster)
    }

    async addClusterTask(taskName, taskObj) {
        if (taskName === 'google-search-crawler') {
            return await this.cluster.execute(taskObj)
        } else if (taskName === 'news') {
            return await this.cluster.execute()
        } else if (taskName === 'url-renderer') {
            return await this.cluster.execute(taskObj)
        }
        return []
    }

    async closeCluster() {
        await this.cluster.idle()
    }
}
