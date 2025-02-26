// @ts-check

import { AfterAll, BeforeAll, Given, Then, When } from "@cucumber/cucumber";
import { chromium } from "@playwright/test";

/** @type {import("@playwright/test").Browser} */
let browser;
/** @type {import("@playwright/test").Page} */
let page;

BeforeAll({ timeout: 10000 }, async function () {
  browser = await chromium.launch({ headless: Boolean(process.env.IS_TEST_HEADLESS) });
  page = await browser.newPage();

  await page.goto("http://localhost:3000/login");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector('[data-test-id="login-email-input"]');

  await page.getByRole("textbox", { name: "Email" }).fill("Alice@gmail.com");
  await page.getByRole("textbox", { name: "Password" }).fill("V74BPPB&");
  await page.getByRole("button", { name: "Login" }).click();
});

AfterAll(async function () {
  await browser.close();
});

Given("the buyer is on the search page", { timeout: 10000 }, async function () {
  await page.goto("http://localhost:3000/search");
  await page.waitForLoadState("domcontentloaded");
});

Given("the buyer is on the chat page", { timeout: 10000 }, async function () {
  await page.goto("http://localhost:3000/chat");
  await page.waitForLoadState("domcontentloaded");
});

When("they click the chat button on a post", { timeout: 15000 }, async function () {
  await page.waitForResponse((response) => response.url().includes("/api/posts") && response.status() === 200);
  await page.waitForSelector('[data-test-id="sign-out"]');
  await page.waitForSelector('[data-test-id="post-card"]');

  const posts = await page.$$('[data-test-id="post-card"]');
  if (posts.length === 0) {
    throw new Error("No posts found");
  }

  await posts[0].waitForSelector('[data-test-id="chat-with-seller"]');
  const chatWithSellerButton = await posts[0].$('[data-test-id="chat-with-seller"]');
  if (!chatWithSellerButton) {
    throw new Error("Chat with seller button not found inside the first post");
  }

  await chatWithSellerButton.click();
});

When("they enter a message and click send", { timeout: 10000 }, async function () {
  await page.waitForSelector('[data-test-id="chat-room"]');

  const chatRooms = await page.$$('[data-test-id="chat-room"]');
  if (chatRooms.length === 0) {
    throw new Error("No chat rooms found");
  }

  await chatRooms[0].click();

  await page.waitForSelector('[data-test-id="chat-input"]');
  await page.fill('[data-test-id="chat-input"]', "hi");
  await page.click('[data-test-id="chat-send-message"]');
});

Then("they should see the chat room with seller on the chat page", { timeout: 20000 }, async function () {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector('[data-test-id="chat-room"]');

  const chatRooms = await page.$$('[data-test-id="chat-room"]');
  if (chatRooms.length === 0) {
    throw new Error("No chat rooms found");
  }
});

Then("they should see the message in the chat room", { timeout: 20000 }, async function () {
  await page.waitForResponse((response) => response.url().includes("/api/chat") && response.status() === 200);
  await page.waitForSelector('[data-test-id="chat-message"]');

  const messages = await page.$$('[data-test-id="chat-message"]');
  if (messages.length === 0) {
    throw new Error("No messages found");
  }

  if (!(await messages[0].textContent())?.includes("hi")) {
    throw new Error("Message not found");
  }
});
