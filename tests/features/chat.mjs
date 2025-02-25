import { AfterAll, BeforeAll, Given, Then, When } from "@cucumber/cucumber";
import { chromium } from "@playwright/test";

let browser;
let page;

BeforeAll(async function () {
  browser = await chromium.launch({ headless: Boolean(process.env.IS_TEST_HEADLESS) });
  page = await browser.newPage();
  await page.goto("http://localhost:3000/login");
  await page.getByRole("textbox", { name: "Email" }).fill("Alice@gmail.com");
  await page.getByRole("textbox", { name: "Password" }).fill("V74BPPB&");
  await page.getByRole("button", { name: "Login" }).click();
});

AfterAll(async function () {
  await browser.close();
});

Given("the buyer is on the search page", async function () {
  await page.goto("http://localhost:3000/search");
});

Given("the buyer is on the chat page", async function () {
  await page.goto("http://localhost:3000/chat");
});

When("they click the chat button on a post", { timeout: 15000 }, async function () {
  await page.waitForResponse((response) => response.url().includes("/api/posts") && response.status() === 200);
  await page.waitForTimeout(2000);
  const posts = await page.$$('[data-test-id="post-card"]');

  if (posts.length === 0) {
    throw new Error("No posts found");
  }
  // click on the first post
  const chatWithSellerButton = await posts[0].$('[data-test-id="chat-with-seller"]');
  await chatWithSellerButton.click();
});

When("they enter a message and click send", { timeout: 10000 }, async function () {
  await page.waitForResponse((response) => response.url().includes("/api/chat") && response.status() === 200);
  await page.waitForTimeout(2000);

  const chatRooms = await page.$$('[data-test-id="chat-room"]');
  if (chatRooms.length === 0) {
    throw new Error("No chat rooms found");
  }
  await chatRooms[0].click();

  await page.fill('[data-test-id="chat-input"]', "hi");
  await page.click('[data-test-id="chat-send-message"]');
});

Then("they should see the chat room with seller on the chat page", { timeout: 20000 }, async function () {
  await page.waitForTimeout(2000);

  const chatRooms = await page.$$('[data-test-id="chat-room"]');
  if (chatRooms.length === 0) {
    throw new Error("No chat rooms found");
  }
});

Then("they should see the message in the chat room", { timeout: 20000 }, async function () {
  await page.waitForResponse((response) => response.url().includes("/api/chat") && response.status() === 200);
  await page.waitForTimeout(2000);

  const messages = await page.$$('[data-test-id="chat-message"]');
  if (messages.length === 0) {
    throw new Error("No messages found");
  }

  if (!(await messages[0].textContent()).includes("hi")) {
    throw new Error("Message not found");
  }
});
