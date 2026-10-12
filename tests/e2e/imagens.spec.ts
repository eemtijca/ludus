import { mkdir } from "node:fs/promises";
import path from "node:path";
import { expect, expectNoPageOverflow, test } from "./fixtures";
import { semearProgresso } from "./helpers/progresso";

const evidenceDirectory = path.resolve(process.cwd(), "docs/imagens");

test.describe("Capturas revisáveis de estados sem dados reais", () => {
  test("hub e professores no desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Capturas de desktop apenas neste projeto.");
    await mkdir(evidenceDirectory, { recursive: true });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("link", { name: /^Jogar / })).toHaveCount(20);
    await expectNoPageOverflow(page);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: path.join(evidenceDirectory, "hub-desktop.png"),
      animations: "disabled",
    });
    await page.goto("/professores");
    await expect(page.getByRole("article")).toHaveCount(20);
    await expectNoPageOverflow(page);
    await page.screenshot({
      path: path.join(evidenceDirectory, "professores-desktop.png"),
      animations: "disabled",
    });
  });

  test("hub, jogo com contraste e progresso no celular", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "Mobile Chrome",
      "Capturas de celular apenas neste projeto.",
    );
    await mkdir(evidenceDirectory, { recursive: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.getByRole("link", { name: /^Jogar / })).toHaveCount(20);
    await expectNoPageOverflow(page);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: path.join(evidenceDirectory, "hub-mobile.png"),
      animations: "disabled",
    });
    await page.getByRole("button", { name: "Alternar alto contraste" }).click();
    await page.getByRole("button", { name: "Alternar texto amplo" }).click();
    await page.goto("/jogo/fonte-suspeita");
    await expect(page.getByRole("region", { name: "Contexto do caso" })).toBeVisible();
    await expectNoPageOverflow(page);
    await page.screenshot({
      path: path.join(evidenceDirectory, "jogo-contraste-mobile.png"),
      animations: "disabled",
      fullPage: true,
    });
    await page.getByRole("button", { name: "Alto contraste", exact: true }).click();
    await page.getByRole("button", { name: "Texto amplo", exact: true }).click();
    await semearProgresso(page);
    await page.goto("/progresso");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Seu progresso");
    await expectNoPageOverflow(page);
    await page.screenshot({
      path: path.join(evidenceDirectory, "progresso-mobile.png"),
      animations: "disabled",
    });
  });
});
