import { AfterAll, BeforeAll, Given, Then, When } from "@cucumber/cucumber";
import { chromium } from "@playwright/test";

let browser;
let page;

BeforeAll(async function () {
  browser = await chromium.launch({ headless: Boolean(process.env.IS_TEST_HEADLESS) });
  page = await browser.newPage();
});

AfterAll(async function () {
  await browser.close();
});

Given("the user is on the search page", async function () {
  await page.goto("http://localhost:3000/search");
});

When("they enter a book title", async function () {
  await page.fill('[data-test-id="search-by-book-name"]', "Quotations from Chairman Mao Tse-Tung");
});

When("they click the sort by price button", async function () {
  await page.click('[data-test-id="sort-by-price"]');
});

When("they enter a book title that does not exist in the database", async function () {
  await page.fill('[data-test-id="search-by-book-name"]', "Nonexistent Book Title");
});

Then("they should see all posts", async function () {
  await page.waitForResponse((response) => response.url().includes("/api/posts") && response.status() === 200);

  const posts = await page.$$('[data-test-id="post-card"]');
  if (posts.length === 0) {
    throw new Error("No posts found");
  }
});

Then("they should see the posts with that title", async function () {
  await page.waitForResponse((response) => response.url().includes("/api/posts") && response.status() === 200);

  const posts = await page.$$('[data-test-id="post-card"]');
  const titles = await Promise.all(posts.map(async (post) => await post.innerText()));
  if (!titles.some((title) => title.includes("Quotations from Chairman Mao Tse-Tung"))) {
    throw new Error("Posts with the title were not found");
  }
});

Then("they should see the posts sorted by price in descending order", async function () {
  await page.waitForResponse((response) => response.url().includes("/api/posts") && response.status() === 200);
  await page.waitForTimeout(1000);

  const posts = await page.$$('[data-test-id="post-card"]');
  const prices = await Promise.all(
    posts.map(async (post) => {
      const priceElement = await post.$('[data-test-id="post-price"]');
      const priceText = await priceElement.innerText();
      return parseFloat(priceText.replace(/[^0-9.-]+/g, ""));
    })
  );

  for (let i = 0; i < prices.length - 1; i++) {
    if (prices[i] < prices[i + 1]) {
      throw new Error("Posts are not sorted by price in descending order");
    }
  }
});

Then("they should see a message indicating that no posts were found", async function () {
  const message = await page.$$('[data-test-id="no-posts-found"]');
  if (!message) {
    throw new Error("No 'no posts found' message displayed");
  }
});
