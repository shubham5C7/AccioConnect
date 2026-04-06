const fs = require("fs");

const writeLog = (fileName,data) =>{
    const entry = `${JSON.stringify(data)} - ${new Date().toISOString()}\n`;

    fs.appendFile(`./Logs/${fileName}.txt`,entry,(err) => {
        if(err) console.error(`Log failed [${filename}]:`, err);
    });
};

module.exports = writeLog;