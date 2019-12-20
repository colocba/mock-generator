const getJsonMocks = async (url) => {
    const urls = await getAllUrls(url);
    const mocks = await fetchJsonsFromUrls(urls);
    return mocks;
}

const getAllUrls = async (rootUrl) => {
    const puppeteer = require('puppeteer');
    const urls = [];
    await puppeteer.launch().then(async browser => {
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
    })
    .catch(err => console.log(err));

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

const isRelevantUrl = (url) => {
    // if (url.includes("survey_data") || url.includes("survey_metadata") || url.includes("translations")) {
    //     return true;
    // }
    // return false;

    if (url.includes("runtime/survey_data")) {
        return true;
    }
    return false;
}

module.exports = {
    getJsonMocks: getJsonMocks
}