const {Cluster} = require('puppeteer-cluster');
const puppeteer = require('puppeteer-core');
const {createTask} = require('./google-search-crawler')
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
        });
        await createTask(this.cluster)
    }

    async addClusterTask(taskName, taskObj) {
        if (taskName === 'google-search-crawler') {
            return await this.cluster.execute(taskObj)
        }
        return []
    }

    async closeCluster() {
        await this.cluster.idle()
    }
}
