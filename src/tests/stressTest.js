const puppeteer = require("puppeteer");
const fs = require("fs");
const os = require("os");
const path = require("path");
process.setMaxListeners(200);

//SET GAME ID HERE
const gameId = 46986;

const gamePage = `http://localhost:3000/game/lobby/${gameId}`;

async function registerUser() {
  const tempDir = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), "puppeteer-")
  );

  const browser = await puppeteer.launch({
    headless: true, // Set to false for visual debugging
    userDataDir: tempDir, // Set a unique path to store cache and local storage data for each instance
  });

  const page = await browser.newPage();
  await page.goto(gamePage, {
    waitUntil: "networkidle2",
    timeout: 10000000,
  });

  await page.click("#guest-register");
}

(async () => {
  // Create an array of registration tasks
  const tasks = Array.from({ length: 29 }, () => registerUser());

  // Run all the tasks in parallel and wait for all of them to complete
  await Promise.all(tasks);
})();
