import { Given, Then, When } from "@cucumber/cucumber";
import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

Given("the user is on the search page", async function () {
  // Launch the browser and navigate to the search page
  await page.goto("http://localhost:3000/search");
});

When("they enter a book title", async function () {
  // Simulate entering a book title in the search field
  await page.fill("#search-field", "Example Book Title");
  await page.click("#search-button");
});

When("they enter a book title that does not exist in the database", async function () {
  // Simulate entering a non-existing book title
  await page.fill("#search-field", "Non-Existent Book");
  await page.click("#search-button");
});

Then("they should see all posts", async function () {
  // Verify that posts are visible on the page
  const posts = await page.$$(".post");
  if (posts.length === 0) {
    throw new Error("No posts found");
  }
  await browser.close();
});

Then("they should see the posts with that title", async function () {
  // Verify that posts with the title appear
  const posts = await page.$$(".post");
  const titles = await Promise.all(posts.map(async (post) => await post.innerText()));
  if (!titles.some((title) => title.includes("Example Book Title"))) {
    throw new Error("Posts with the title were not found");
  }
  await browser.close();
});

Then("they should see a message indicating that no posts were found", async function () {
  // Verify that a message indicating no posts found appears
  const message = await page.$("#no-posts-message");
  if (!message) {
    throw new Error("No 'no posts found' message displayed");
  }
  await browser.close();
});
