const {isRelevantUrl, getChromeExecutablePathByOS} = require("./utils");

const getJsonMocks = async (url) => {
    const urls = await getAllUrls(url);
    const mocks = await fetchJsonsFromUrls(urls);
    return mocks;
}

const getAllUrls = async (rootUrl) => {
    const puppeteer = require('puppeteer');
    const urls = [];
    const currentPath = getChromeExecutablePathByOS();
    const browser = await puppeteer.launch({executablePath: currentPath}).catch(err => console.log(err));
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {
        if (isRelevantUrl(interceptedRequest.url())) {
            urls.push(interceptedRequest.url());
            interceptedRequest.abort();
        } else {
            interceptedRequest.continue();
        }
    });
    await page.goto(rootUrl);
    await browser.close()

    return urls;
}

const fetchJsonsFromUrls = async (urls) => {
    let jsons = [];

    for (const url of urls) {
        const data = await fetchJsonFromUrl(url);
        jsons.push(data);
    }
    return jsons;
}

const fetchJsonFromUrl = async (url) => {
    const fetch = require('node-fetch');
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

module.exports = {
    getJsonMocks: getJsonMocks
}