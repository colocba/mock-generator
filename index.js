const inquirer = require('inquirer');
const {getJsonMocks} = require('./services/fetchService');
const {getFolderNames, saveMocksInFileSystem, setNewPathOnIndexFile} = require('./services/fileSystemService');

/* When supporting metadata and translations as well */
// function mockAllJsons(answers) {
//     return answers.jsonToMock === "All";
// }

/* When supporting metadata and translations as well */
// const questions = [
//     { type: 'input', name: 'url', message: "Enter the URL", prefix: '@' },
//     { type: 'list', name: 'jsonToMock', message: "What json would you like to mock", choices: ["Survey data", "Survey metadata", "Translations", "All"] },
//     { type: 'input', name: 'fileName', message: "Enter the name of the mock file", when: !mockAllJsons },
//     { type: 'input', name: 'surveyFileName', message: "Enter the name of the Survey data mock file", when: mockAllJsons },
//     { type: 'input', name: 'metaFileName', message: "Enter the name of the Survey metadata mock file", when: mockAllJsons },
//     { type: 'input', name: 'translationsFileName', message: "Enter the name of the Translations mock file", when: mockAllJsons }
// ];

const questions = [
    { type: 'input', name: 'url', message: "Enter the URL", prefix: '@' },
    { type: 'list', name: 'folder', message: "In which data folder do you want to save it?", choices: getFolderNames() },
    { type: 'input', name: 'fileName', message: "Enter the name of the mock file" }
];

askQuestions(questions);

async function askQuestions(questions) {
    const answers = await inquirer.prompt(questions)
        .then(ans => ans)
        .catch(err => console.log(err));
    handleAnswers(answers);
}

const handleAnswers = async (answers) => {
    const { url, fileName, folder } = answers;
    const jsonMocks = await getJsonMocks(url);
    const fileNameWithFolder = folder !== "data" ? folder + "/" + fileName : fileName;
    saveMocksInFileSystem(jsonMocks, fileNameWithFolder);
    setNewPathOnIndexFile(fileNameWithFolder);
}


// https://www.trainingquicksurveys.com/s/Bi75Z