import { expect, Page, test } from "@playwright/test";

test("Bookbook Home Page", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page.getByText("ร้านหนังสือออนไลน์")).toBeInViewport();
  await expect(page.getByRole("heading", { name: "Book Book 📚" })).toBeInViewport();
});

test("Search Page", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("navigation").getByRole("link", { name: "ค้นหาหนังสือ" }).click();

  // expect page url to be /search

  await expect(page).toHaveURL("http://localhost:3000/search");

  // expect to find text Mao Tse-Tung
  await expect(page.getByText("Mao Tse-Tung").first()).toBeVisible();
});

test("Login Failure", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Go to Login Page
  await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();
  await expect(page).toHaveURL("http://localhost:3000/login?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F");

  // Attempt Login
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("bocchi@btr.gay");

  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("kitaikuyo");
  await page.getByRole("button", { name: "Login" }).click();

  // Expect Failure
  await expect(page).toHaveURL("http://localhost:3000/login?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F");
  await expect(page.getByText("Invalid credentials")).toBeVisible();
});

async function login(page: Page) {
  await page.goto("http://localhost:3000/");

  // Go to Login Page
  await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();
  await expect(page).toHaveURL("http://localhost:3000/login?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F");

  // Attempt Login
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("Alice@gmail.com");

  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("V74BPPB&");

  await page.getByRole("button", { name: "Login" }).click();

  // Expect Success
  await expect(page).toHaveURL("http://localhost:3000/");
}

test("Login Success", async ({ page }) => {
  await login(page);

  // Go to Profile Page
  await page.getByRole("link", { name: "Profile" }).click();
  await expect(page).toHaveURL("http://localhost:3000/profile");

  // Check Profile
  await expect(page.locator('input[name="email"]')).toHaveValue("Alice@gmail.com");
  await expect(page.locator('input[name="firstName"]')).toHaveValue("Alice");
});

test("Post Sell Book", async ({ page }) => {
  await login(page);
  await page.goto("http://localhost:3000/");

  await page.getByRole("button", { name: "ขายหนังสือของคุณ" }).click();
  await page
    .getByRole("listitem")
    .filter({ hasText: "人妻教師が教え子の女子高生にドはまりする話2" })
    .getByRole("button")
    .click();

  await page.getByTestId("post-title").fill("ช่วยซื้อหนังสือเกผมหน่อย");
  await page.getByTestId("book-price").fill("69");
  await page.getByRole("button", { name: "โพสต์ขายหนังสือ" }).click();

  await expect(page.getByText("ช่วยซื้อหนังสือเกผมหน่อย")).toBeVisible();

  await expect(page.getByText("Alice Adams")).toBeVisible();
  await expect(page.getByText("69")).toBeVisible();
  await expect(page.getByText("人妻教師が教え子の女子高生にドはまりする話2")).toBeVisible();
  await expect(page.getByText("นี่เป็นหนังสือของคุณ")).toBeVisible();
});
