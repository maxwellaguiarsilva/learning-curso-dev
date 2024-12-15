const { exec } = require("node:child_process");

const CHECK_COMMAND = "docker exec postgres-dev pg_isready --host localhost";
const SUCCESS_TEXT = "accepting connections";
const TIME_TO_RETRY = 100;
const WAITING_MESSAGE = "\nDatabase service: ⏳";
const SUCCESS_MESSAGE = "\nDatabase service: ✅\n";

function checkDatabaseService() {
  exec(CHECK_COMMAND, handleReturn);
  function handleReturn(error, stdout, stderr) {
    if (!stdout.includes(SUCCESS_TEXT)) {
      process.stdout.write(".");
      setTimeout(checkDatabaseService, TIME_TO_RETRY);
      return;
    }
    console.log(SUCCESS_MESSAGE);
  }
}

console.log(WAITING_MESSAGE);
checkDatabaseService();
