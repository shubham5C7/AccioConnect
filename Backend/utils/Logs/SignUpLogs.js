const fs = require("fs");
const SignUpLogs = (newUser) => {
  const logData = `${newUser.email}, signUp time at ${new Date()}\n`;
  fs.writeFile("./Logs/SignUpLogs.txt", logData, (err, result) => {
    if (err) {
      console.log(err, "err in the signUplogs");
    } else {
      console.log(result);
    }
  });
};

module.exports = SignUpLogs;
