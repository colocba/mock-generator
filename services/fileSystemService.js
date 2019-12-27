const {writeFile, readdirSync, statSync} = require('fs');
const { join } = require("path");
var replace = require("replace");

/* When supporting metadata and translations as well */
const saveAllMocksInFileSystem = (jsonMocks, fileName, surveyFileName, metaFileName, translationsFileName) => {
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

const saveMocksInFileSystem = (jsonMocks, fileName) => {
    if (!fileName) {
        const fileNames = [surveyFileName, metaFileName, translationsFileName];
        let filesIndex = 0;
        jsonMocks.forEach(mock => {
            createFile(mock, fileNames[filesIndex++]);
        });
    } else {
        createFile(jsonMocks[0], fileName);
    }
}

const setNewPathOnIndexFile = (fileName) => {
    const rootPath = __dirname + '/../../mockapi/src/index.js';
    replace({
        regex: "import defaultSurvey from[^\n]+",
        replacement: `import defaultSurvey from './data/${fileName}'`,
        paths: [rootPath],
        recursive: false,
        silent: true
    });
}

const createFile = (mock, fileName) => {
    const rootPath = __dirname + '/../../mockapi/src/data';
    const updatedPath = rootPath + `/${fileName}.json`;
    const mockString = JSON.stringify(mock);
    writeFile(updatedPath, mockString, (err, file) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(`${fileName}.json has been updated`);
    });
}

const getFolderNames = () => {
    const rootPath = __dirname + '/../../mockapi/src/data';
    try {
        const dirs = readdirSync(rootPath)
                        .filter(f => statSync(join(rootPath, f))
                        .isDirectory())
        return [...dirs, 'data'];
    } catch (err) {
        return ['data'];
    }
}

module.exports = {
    saveMocksInFileSystem: saveMocksInFileSystem,
    saveAllMocksInFileSystem: saveAllMocksInFileSystem,
    getFolderNames: getFolderNames,
    setNewPathOnIndexFile: setNewPathOnIndexFile
}