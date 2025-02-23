import { expect, test } from "@playwright/test";

test("Bookbook Home Page", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page.getByRole("heading", { name: "ยินดีต้อนรับสู่ Book Book 📚" })).toBeInViewport();
});
