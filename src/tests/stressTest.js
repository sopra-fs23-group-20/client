const puppeteer = require("puppeteer");
const fs = require("fs");
const os = require("os");
const path = require("path");
process.setMaxListeners(50);

//Register URL
const registerPage = "https://sopra-fs23-group20-client.pktriot.net/register";

//Needs to be created before running the script and then set the game-URL here
const specificGamePage =
  "https://sopra-fs23-group20-client.pktriot.net/game/lobby/72947";

async function registerUser() {
  const tempDir = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), "puppeteer-")
  );

  const browser = await puppeteer.launch({
    headless: true, // Set to false for visual debugging
    userDataDir: tempDir, // Set a unique path to store cache and local storage data for each instance
  });

  const page = await browser.newPage();
  await page.goto(registerPage, { waitUntil: "networkidle2" });

  // Generate random username and password
  const username = "user_" + Math.random().toString(36).substring(7);
  const password = Math.random().toString(36).substring(7);

  const usernameInputSelector = "#username";
  const passwordInputSelector = "#password";
  const registerButtonSelector = 'button[type="submit"]';

  await page.type(usernameInputSelector, username);
  await page.type(passwordInputSelector, password);
  await page.click(registerButtonSelector);

  await page.waitForNavigation(); // Wait for the registration process to complete

  console.log(`Registered: ${username} / ${password}`);
  await page.goto(specificGamePage);
}

(async () => {
  // Create an array of registration tasks
  const tasks = Array.from({ length: 9 }, () => registerUser());

  // Run all the tasks in parallel and wait for all of them to complete
  await Promise.all(tasks);
})();
