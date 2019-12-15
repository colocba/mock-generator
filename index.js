const inquirer = require('inquirer');
const fs = require('fs');

function mockAllJsons(answers) {
    return answers.jsonToMock === "All";
}

async function askQuestions(questions) {
    const answers = await inquirer.prompt(questions)
        .then(ans => ans)
        .catch(err => console.log(err));
    handleAnswers(answers);
}

const saveMocksInFileSystem = (jsonMocks, fileName, surveyFileName, metaFileName, translationsFileName) => {
    let paths = [];
    if (!fileName) {
        const fileNames = [surveyFileName, metaFileName, translationsFileName];
        let filesIndex = 0;
        jsonMocks.forEach(mock => {
            paths.push(createFile(mock, fileNames[filesIndex++]));
        });
    } else {
        paths.push(createFile(mocks[0], fileName));
    }

    return paths;
}

const createFile = (mock, fileName) => {
    const rootPath = "mockapi/src/data";
    const updatedPath = rootPath + `/${fileName}.json`;
    fs.writeFile(updatedPath, mock, (err, file) => {
        if (err) {
            console.log(err);
            return;
        }
    })
    return updatedPath;
}

const handleAnswers = (answers) => {
    const { url, jsonToMock, fileName, surveyFileName, metaFileName, translationsFileName } = answers;
    // const jsonMocks = [JSON.stringify({ "bob": "sponge" }), JSON.stringify({ "bob": "sponge" }), JSON.stringify({ "bob": "sponge" })];
    const jsonMocks = getJsonMocks(url);
    // let pathsOfFiles = saveMocksInFileSystem(jsonMocks, fileName, surveyFileName, metaFileName, translationsFileName);
    // pathsOfFiles.forEach(path => {
    //     console.log(`Path ${path} updated`);
    // });
}

const questions = [
    { type: 'input', name: 'url', message: "Enter the URL", prefix: '@' },
    { type: 'list', name: 'jsonToMock', message: "What json would you like to mock", choices: ["Survey data", "Survey metadata", "Translations", "All"] },
    { type: 'input', name: 'fileName', message: "Enter the name of the mock file", when: !mockAllJsons },
    { type: 'input', name: 'surveyFileName', message: "Enter the name of the Survey data mock file", when: mockAllJsons },
    { type: 'input', name: 'metaFileName', message: "Enter the name of the Survey metadata mock file", when: mockAllJsons },
    { type: 'input', name: 'translationsFileName', message: "Enter the name of the Translations mock file", when: mockAllJsons }
];

askQuestions(questions);

const getJsonMocks = async (url) => {
    const urls = await getAllUrls(url);
    return fetchJsonsFromUrls(urls);
}

const getAllUrls = async (rootUrl) => {
    const puppeteer = require('puppeteer');
    const urls = [];
    const pupyResponse = await puppeteer.launch().then(async browser => {
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', interceptedRequest => {
            if (isRelevantUrl(interceptedRequest.url())) {
                urls.push(interceptedRequest.url());
            }
            if (interceptedRequest.url().includes("translations")) {
                browser.close();
            } else {
                interceptedRequest.continue();
            }
        });
        await page.goto(rootUrl);
    });
    return urls;
}

const fetchJsonsFromUrls = (urls) => {
    let jsons = [];
    urls.forEach(url => {
        jsons.push(fetchUrl(url))
    })
    console.log(jsons)
}

const fetchUrl = async (url) => {
    const fetch = require('node-fetch');
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

const isRelevantUrl = (url) => {
    if (url.includes("survey_data") || url.includes("survey_metadata") || url.includes("translations")) {
        return true;
    }
    return false;
}


// https://www.trainingquicksurveys.com/s/Bi75Z