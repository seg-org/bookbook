// @ts-check

import { AfterAll, BeforeAll, Given, Then, When } from "@cucumber/cucumber";
import { chromium, expect } from "@playwright/test";

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

Given("the buyer, about to test autocomplete, is on the search page", { timeout: 10000 }, async () => {
  await page.goto("http://localhost:3000/search");
  await page.waitForLoadState("domcontentloaded");
});

When("they enter a book title {string}", { timeout: 10000 }, async (titleInitial) => {
  const element = page.getByTestId("search-by-book-name");
  expect(page.getByTestId("search-by-book-name")).toBeVisible();
  await element.fill(titleInitial);
  expect(await element.inputValue()).toBe(titleInitial);
});

Then("they should see suggestions for book titles that match {string}", { timeout: 10000 }, async (titleInitial) => {
  await page.waitForResponse((response) => response.url().includes("/api/posts") && response.status() === 200);

  const allSuggestions = await page.getByTestId("autocomplete-suggested-books").locator("button").all();

  expect(allSuggestions.length).toBeGreaterThan(0);

  await Promise.all(
    allSuggestions.map(async (suggestion) => {
      await expect(suggestion).toBeVisible();
      expect(await suggestion.textContent()).toContain(titleInitial);
    }),
  );
});

When("they click on a suggestion {string}", { timeout: 10000 }, async (titleSelected) => {
  const suggestions = page.locator(`[data-testid="autocomplete-suggested-books"] >> text="${titleSelected}"`);

  expect(await suggestions.count()).toBe(1);

  const suggestionBtn = suggestions.first();
  await expect(suggestionBtn).toBeVisible();
  await suggestionBtn.click();
});

Then(
  "the search field should be filled with the selected book title {string}",
  { timeout: 10000 },
  async (titleSelected) => {
    const searchField = page.getByTestId("search-by-book-name");
    await expect(searchField).toBeVisible();
    expect(await searchField.inputValue()).toBe(titleSelected);
  },
);

Then("the suggestion box should disappear", { timeout: 10000 }, async () => {
  await expect(page.getByTestId("autocomplete-suggested-books")).toBeHidden();
});

Then("they should see suggestions showing {string}", { timeout: 10000 }, async (message) => {
  const allSuggestions = await page.getByTestId("autocomplete-suggested-books").locator("p").all();
  expect(allSuggestions.length).toBe(1);
  expect(await allSuggestions[0].textContent()).toContain(message);
});
