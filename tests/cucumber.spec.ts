import { test } from "@playwright/test";
import { execSync } from "child_process";

test("Run Cucumber tests", async () => {
  execSync("pnpm cucumber", { stdio: "inherit" });
});
