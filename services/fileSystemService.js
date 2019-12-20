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
    const rootPath = "mockapi/src/data";
    console.log(fileName)
    replace({
        regex: "import defaultSurvey from './data/amir/RUN-1291'",
        replacement: "Lala",
        paths: [rootPath],
        recursive: false,
        silent: true
    });
}

const createFile = (mock, fileName) => {
    const rootPath = "mockapi/src/data";
    const updatedPath = rootPath + `/${fileName}.json`;
    const mockString = JSON.stringify(mock);
    writeFile(updatedPath, mockString, (err, file) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(`${updatedPath} has been updated`);
    });
}

const getFolderNames = () => {
    const rootPath = 'mockapi/src/data';
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