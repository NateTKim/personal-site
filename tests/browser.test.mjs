import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import { test } from "node:test";

const toolDir = path.resolve(process.env.AUDIT_TOOL_DIR ?? "node_modules/.portfolio-audit");
const require = createRequire(path.join(toolDir, "loader.cjs"));
const engines = require("playwright");
const axePath = require.resolve("axe-core/axe.min.js");
const origin = process.env.TEST_SITE_URL ?? "http://127.0.0.1:3200";
const missing = "/missing-portfolio-regression-route";
const cases = ["alphaeon", "business-software", "chewy", "codeforgood", "orin"].map(
  (slug) => "/work/" + slug,
);
const routes = ["/", "/info", ...cases, missing];
const widths = [320, 375, 390, 430, 768, 1024, 1440, 1920, 2560];
const website = (route) => new URL(route, origin).href;
const goto = (page, route) => page.goto(website(route), { waitUntil: "networkidle" });
const menuButton = (page) => page.getByRole("button", { name: /open menu/i });
const menu = (page) => page.getByRole("dialog", { name: "Menu", exact: true });
const waitFocused = (locator) =>
  locator.evaluate((element) => {
    if (element !== document.activeElement) throw new Error("Expected control to hold focus");
  });
const panel = (page) => page.locator("#orin-demo-result");

async function axe(page) {
  await page.addScriptTag({ path: axePath });
  const violations = await page.evaluate(async () => {
    const result = await window.axe.run({
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
    });
    return result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) }));
  });
  assert.deepEqual(violations, []);
}

for (const name of ["chromium", "firefox", "webkit"]) {
  test(name + " production-build browser regression", async (suite) => {
    const browser = await engines[name].launch();
    suite.after(() => browser.close());
    const context = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1440, height: 900 },
    });
    suite.after(() => context.close());
    const page = await context.newPage();
    page.setDefaultTimeout(8500);

    await suite.test(
      "all pages render at nine widths with no root overflow, broken assets or uncaught errors",
      async () => {
        const errors = [];
        const onError = (error) => errors.push(error.name);
        page.on("pageerror", onError);
        try {
          for (const route of routes) {
            // Keep the page open to check breakpoint changes without introducing prefetch cancellations.
            const response = await goto(page, route);
            assert.equal(response.status(), route === missing ? 404 : 200);
            for (const width of widths) {
              await page.setViewportSize({ width, height: 900 });
              const state = await page.evaluate(() => ({
                headings: document.querySelectorAll("h1").length,
                main: document.querySelectorAll("main").length,
                overflow: document.documentElement.scrollWidth - innerWidth,
                brokenImages: [...document.images].filter((image) => image.complete && !image.naturalWidth)
                  .length,
              }));
              assert.deepEqual(
                state,
                { headings: 1, main: 1, overflow: 0, brokenImages: 0 },
                `${route} at ${width}`,
              );
            }
          }
        } finally {
          page.off("pageerror", onError);
        }
        assert.deepEqual(errors, []);
      },
    );

    await suite.test("desktop menu keyboard trap and every dismissal restores its opener", async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await goto(page, "/");
      const trigger = menuButton(page);
      for (const opener of ["click", "shortcut"]) {
        for (const closer of ["Escape", "close button", "outside"]) {
          const prior =
            opener === "shortcut"
              ? page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Info" })
              : trigger;
          await prior.focus();
          if (opener === "shortcut") await page.keyboard.press("Control+k");
          else await trigger.click();
          const dialog = menu(page);
          await dialog.waitFor();
          assert.equal(await page.locator('button[aria-haspopup="dialog"]').getAttribute("aria-expanded"), "true");
          await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "combobox");
          for (const key of ["Tab", "Tab", "Shift+Tab"]) {
            await page.keyboard.press(key);
            // Focus guards wrap the keyboard cycle on the following animation frame.
            await page.waitForFunction(() => Boolean(document.activeElement?.closest('[role="dialog"]')));
          }
          if (closer === "Escape") await page.keyboard.press("Escape");
          if (closer === "close button") await dialog.getByRole("button", { name: "Close menu" }).click();
          if (closer === "outside") await page.mouse.click(5, 5);
          await dialog.waitFor({ state: "hidden" });
          await prior.evaluate(
            (element) =>
              new Promise((resolve, reject) => {
                requestAnimationFrame(() =>
                  element === document.activeElement
                    ? resolve()
                    : reject(new Error("Focus did not return to opener")),
                );
              }),
          );
        }
      }
      await trigger.click();
      const dialog = menu(page);
      await dialog.getByRole("combobox").fill("Contact");
      await page.keyboard.press("ArrowDown");
      await dialog.getByRole("option", { name: "Contact", exact: true }).click();
      await dialog.waitFor({ state: "hidden" });
      await page.waitForFunction(() => Boolean(document.activeElement?.closest("#contact")));
      await trigger.click();
      await dialog.getByRole("combobox").fill("Business-Software");
      await page.keyboard.press("Enter");
      await page.waitForURL(website("/work/business-software"));
      await dialog.waitFor({ state: "hidden" });
    });

    await suite.test("mobile menu, skip link, case links and history", async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await goto(page, "/");
      await page.getByRole("link", { name: "Skip to content" }).focus();
      await page.keyboard.press("Enter");
      await page.waitForFunction(() => document.activeElement?.id === "main");
      await menuButton(page).click();
      await menu(page).getByRole("option", { name: "Info", exact: true }).click();
      await page.waitForURL(website("/info"));
      await page.getByRole("heading", { level: 1 }).waitFor();
      await page.goBack();
      await page.waitForURL(website("/#main"));
      await page.getByRole("main").locator(`a[href="${cases[0]}"]`).first().click();
      await page.waitForURL(website(cases[0]));
      const work = page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work" });
      assert.equal(await work.getAttribute("aria-current"), null);
      await page
        .getByRole("navigation", { name: "More work" })
        .getByRole("link", { name: "All work" })
        .click();
      await page.waitForURL(website("/#work"));
    });

    await suite.test("404 recovery under repeated rapid and settled navigation", async () => {
      const errors = [];
      const onError = (error) => errors.push(error.name);
      page.on("pageerror", onError);
      try {
        for (const width of [768, 1440]) {
          await page.setViewportSize({ width, height: 900 });
          for (let attempt = 0; attempt < 3; attempt++) {
            const response = await page.goto(website(missing), {
              waitUntil: attempt === 1 ? "load" : "networkidle",
            });
            assert.ok([404, 304].includes(response.status()));
            await page.getByRole("link", { name: "Back to the work" }).click();
            await page.waitForURL(website("/"));
            await page.getByRole("heading", { name: /Hi, I’m Nate/i }).waitFor();
          }
        }
      } finally {
        page.off("pageerror", onError);
      }
      assert.deepEqual(errors, []);
    });

    await suite.test("cached Orin labels, disclosure, chart data and input branches", async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await goto(page, "/work/orin");
      const result = panel(page);
      const input = page.getByRole("textbox", { name: "Stock ticker" });
      const submit = async (value) => {
        await input.fill(value);
        await page.getByRole("button", { name: "Explain it" }).click();
      };
      for (const [ticker, company, date] of [
        ["AAPL", /Apple/i, "July 31, 2026"],
        ["NVDA", /NVIDIA/i, "May 20, 2026"],
        ["TSLA", /Tesla/i, "July 23, 2026"],
        ["AMZN", /Amazon/i, "April 30, 2026"],
      ]) {
        await page.getByRole("button", { name: ticker, exact: true }).click();
        await result.getByRole("heading", { name: company }).waitFor();
        assert.equal(
          await page.getByRole("button", { name: ticker, exact: true }).getAttribute("aria-pressed"),
          "true",
        );
        assert.match(await result.getByText(/Filing analyzed/).innerText(), new RegExp(date));
        assert.equal(await result.getByText(/Latest report/i).count(), 0);
        await page.getByText(/Historical demo · cached sample/).waitFor();
      }
      await submit(" aapl ");
      await result.getByRole("heading", { name: /Apple/i }).waitFor();
      const disclosure = page.getByRole("button", { name: "Show the full analysis" });
      assert.equal(await disclosure.getAttribute("aria-expanded"), "false");
      assert.equal(await result.getByRole("region", { name: "Plain-English summary" }).count(), 0);
      await disclosure.click();
      await result.getByRole("region", { name: "Plain-English summary" }).waitFor();
      await result.getByText("View chart data", { exact: true }).click();
      const table = result.getByRole("table", { name: "Revenue and earnings per share by period" });
      await table.getByRole("columnheader", { name: "Earnings per share" }).waitFor();
      assert.match(await table.innerText(), /\$1\.57/);
      assert.match(
        await result.getByRole("link", { name: /Read the official report/ }).getAttribute("href"),
        /^https:\/\/www\.sec\.gov\//,
      );
      await page.getByRole("button", { name: "Show less" }).click();
      assert.equal(await result.getByRole("region", { name: "Plain-English summary" }).count(), 0);
      for (const invalid of ["", "   ", "ABCDEFGHIJKL", "A..", "123", "AAPL?", "A--", "AP PL", "ß", "ＡＡＰＬ"]) {
        await submit(invalid);
        assert.equal(await input.getAttribute("aria-invalid"), "true");
        assert.match(await page.locator("#demo-ticker-error").innerText(), /Enter a/);
        await result.getByRole("heading", { name: /Apple/i }).waitFor();
      }
      for (const symbol of ["MSFT", "BRK.B", "BRK-B"]) {
        await submit(symbol);
        const href = await result
          .getByRole("link", { name: new RegExp("Look up " + symbol + " on Orin") })
          .getAttribute("href");
        assert.equal(new URL(href).origin, "https://readorin.com");
        assert.equal(new URL(href).searchParams.get("ticker"), symbol);
      }
      await submit("nate");
      await result.getByRole("link", { name: /public résumé/ }).waitFor();
      await page.getByRole("button", { name: "AMZN", exact: true }).click();
      await result.getByRole("heading", { name: /Amazon/i }).waitFor();
      assert.equal(await disclosure.getAttribute("aria-expanded"), "false");
    });

    await suite.test("clipboard denial, résumé and safe external link contracts", async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await goto(page, "/info");
      const header = page.getByRole("banner");
      assert.equal(
        await header.getByRole("link", { name: "Resume" }).getAttribute("href"),
        "/Nathanael_Kim_Resume.pdf",
      );
      for (const linkName of ["GitHub", "LinkedIn"]) {
        const link = header.getByRole("link", { name: new RegExp(linkName) });
        assert.ok((await link.getAttribute("href")).startsWith("https://"));
        assert.equal(await link.getAttribute("target"), "_blank");
        assert.match(await link.getAttribute("rel"), /noopener/);
      }
      await page.getByRole("link", { name: /read it/i }).waitFor();
      await page.evaluate(() =>
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: { writeText: () => Promise.reject(new DOMException("Denied", "NotAllowedError")) },
        }),
      );
      await page.getByRole("button", { name: "Copy email", exact: true }).click();
      await page.getByRole("button", { name: /Copy failed/ }).waitFor();
    });

    await suite.test("JavaScript-disabled mobile navigation and chart-data fallback", async () => {
      const noJs = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width: 390, height: 844 },
      });
      try {
        const fallback = await noJs.newPage();
        await goto(fallback, "/");
        await fallback.locator(".nojs-menu summary").click();
        await fallback.getByRole("banner").getByRole("link", { name: "Resume" }).waitFor();
        await goto(fallback, "/work/orin");
        assert.equal(await fallback.getByRole("button", { name: "Explain it" }).count(), 0);
        await fallback.getByRole("region", { name: "Plain-English summary" }).waitFor();
        await fallback.getByText("View chart data", { exact: true }).click();
        await fallback.getByRole("table", { name: "Revenue and earnings per share by period" }).waitFor();
      } finally {
        await noJs.close();
      }
    });

    if (name === "chromium") {
      await suite.test("axe on all pages at two viewports and on interactive states", async () => {
        for (const width of [390, 1440]) {
          await page.setViewportSize({ width, height: 900 });
          for (const route of routes) {
            await goto(page, route);
            await axe(page);
          }
        }
        await goto(page, "/");
        await menuButton(page).click();
        await menu(page).waitFor();
        await axe(page);
        await page.keyboard.press("Escape");
        await goto(page, "/work/orin");
        await page.getByRole("button", { name: "Show the full analysis" }).click();
        await page.getByText("View chart data", { exact: true }).click();
        await axe(page);
        await waitFocused(page.getByText("View chart data", { exact: true }));
      });
    }
  });
}
