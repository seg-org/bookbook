import { Given, Then, When } from "@cucumber/cucumber";
import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

Given("the user is on the search page", async function () {
  await page.goto("http://localhost:3000/search");
});

When("they enter a book title", async function () {
  await page.fill('[data-test-id="search-by-book-name"]', "Quotations from Chairman Mao Tse-Tung");
});

When("they enter a book title that does not exist in the database", async function () {
  await page.fill('[data-test-id="search-by-book-name"]', "Nonexistent Book Title");
});

Then("they should see all posts", async function () {
  const posts = await page.$$('[data-test-id="post-card"]');
  if (posts.length === 0) {
    throw new Error("No posts found");
  }
  await browser.close();
});

Then("they should see the posts with that title", async function () {
  const posts = await page.$$('[data-test-id="post-card"]');
  const titles = await Promise.all(posts.map(async (post) => await post.innerText()));
  if (!titles.some((title) => title.includes("Quotations from Chairman Mao Tse-Tung"))) {
    throw new Error("Posts with the title were not found");
  }
  await browser.close();
});

Then("they should see a message indicating that no posts were found", async function () {
  const message = await page.$$('[data-test-id="no-posts-found"]');
  if (!message) {
    throw new Error("No 'no posts found' message displayed");
  }
  await browser.close();
});
