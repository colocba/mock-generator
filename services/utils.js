const process = require("process");
const {OPERATING_SYSTEMS, CHROME_PATHS} = require("./constants");

const getChromeExecutablePathByOS = () => {
    const opsys = process.platform;
    switch(opsys) {
        case(OPERATING_SYSTEMS.WINDOWS) :
            return CHROME_PATHS.WINDOWS;
        case(OPERATING_SYSTEMS.MACOS) :
            return CHROME_PATHS.MACOS;
    }
};

const isRelevantUrl = (url) => {
    // if (url.includes("survey_data") || url.includes("survey_metadata") || url.includes("translations")) {
    //     return true;
    // }
    // return false;

    if (url.includes("runtime/survey_data")) {
        return true;
    }
    return false;
};

module.exports = {
    getChromeExecutablePathByOS: getChromeExecutablePathByOS,
    isRelevantUrl: isRelevantUrl
};