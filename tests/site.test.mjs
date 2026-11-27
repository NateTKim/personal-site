import assert from "node:assert/strict";
import { after, test } from "node:test";
import { startSite } from "./support/server.mjs";

const site = await startSite();
after(() => site.stop());
const { origin } = site;
const canonical = "https://nathanaelkim.com";
const routes = [
  "/",
  "/info",
  "/work/alphaeon",
  "/work/business-software",
  "/work/chewy",
  "/work/codeforgood",
  "/work/orin",
];
const request = (path) => fetch(new URL(path, origin), { redirect: "manual" });
const capture = (html, pattern) => html.match(pattern)?.[1];

function assertPrivateContactAbsent(text) {
  assert.ok(
    !/\b(?:\+1[ .-]?)?(?:\(\d{3}\)[ .-]?|\d{3}[ .-])\d{3}[ .-]\d{4}\b/.test(text),
    "No published phone pattern",
  );
  assert.ok(!/\b(?:[A-Z]{2}),? (?:\d{5})(?:-\d{4})?\b/.test(text), "No state and ZIP pattern");
  assert.ok(
    !/\b\d{1,6} [\w .'-]{2,40} (?:St(?:reet)?|Ave(?:nue)?|Dr(?:ive)?|Lane|Ln|Road|Rd|Court|Ct)\b/i.test(text),
    "No street address pattern",
  );
}

test("primary HTML is unique, indexable, canonical and free of recognized private contact patterns", async () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const route of routes) {
    const response = await request(route);
    assert.equal(response.status, 200, route);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff", route);
    assert.equal(response.headers.get("x-frame-options"), "SAMEORIGIN", route);
    assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin", route);
    assert.match(response.headers.get("permissions-policy") ?? "", /camera=\(\)/);
    const html = await response.text();
    assertPrivateContactAbsent(html);
    const title = capture(html, /<title>([^<]+)<\/title>/);
    const description = capture(html, /<meta name="description" content="([^"]+)"/);
    assert.ok(title && description, route);
    titles.add(title);
    descriptions.add(description);
    const href = capture(html, /<link rel="canonical" href="([^"]+)"/);
    assert.ok(href === canonical + route || (route === "/" && href === canonical), `Canonical for ${route}`);
    assert.ok(!/<meta name="robots" content="[^"]*noindex/i.test(html), `Indexable ${route}`);
    assert.ok(
      /<meta property="og:image" content="https:\/\/nathanaelkim\.com\/opengraph-image/.test(html),
      `OG image for ${route}`,
    );
    assert.ok(
      /<meta name="twitter:card" content="summary_large_image"/.test(html),
      `Social card for ${route}`,
    );
    assert.ok(/<link rel="icon" href="\/icon.svg/.test(html), `Icon for ${route}`);
    if (route === "/info") {
      assert.ok(/Bachelor of Business Administration/.test(html), "Info names the BBA");
      assert.ok(/additional major[^<]{0,40}Computer Science/i.test(html), "Info names the additional major");
      assert.ok(
        !/Bachelor of Science|dual degree|UW-Madison/i.test(html),
        "No second degree or hyphenated campus name",
      );
      let data;
      try {
        data = JSON.parse(capture(html, /<script type="application\/ld\+json">([^<]+)<\/script>/));
      } catch {
        assert.fail("Info has valid profile JSON-LD");
      }
      assert.ok(data?.["@type"] === "ProfilePage", "Info has ProfilePage data");
      const person = data.mainEntity;
      assert.ok(person?.["@type"] === "Person", "Info has a Person entity");
      assert.ok(
        person.name === "Nathanael Kim" && person.alternateName === "Nate Kim",
        "Person names match the public profile",
      );
      assert.ok(
        !("telephone" in person) && !("address" in person),
        "Person has no restricted contact fields",
      );
    }
  }
  assert.equal(titles.size, routes.length);
  assert.equal(descriptions.size, routes.length);
});

test("sitemap, robots and exact redirect contracts", async () => {
  const sitemap = await request("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const locations = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.ok(
    locations.length === routes.length && routes.every((route) => locations.includes(canonical + route)),
    "Sitemap contains exactly the canonical routes",
  );
  const robots = await request("/robots.txt");
  assert.equal(robots.status, 200);
  assert.ok(
    /Sitemap: https:\/\/nathanaelkim\.com\/sitemap\.xml/.test(await robots.text()),
    "Robots points to the canonical sitemap",
  );
  const redirect = await request("/orin?source=test");
  assert.equal(redirect.status, 308);
  assert.equal(new URL(redirect.headers.get("location"), origin).pathname, "/work/orin");
  assert.equal(new URL(redirect.headers.get("location"), origin).search, "?source=test");
});

test("404 recovery, public assets and private routes", async () => {
  const missing = await request("/missing-portfolio-regression-route");
  assert.equal(missing.status, 404);
  const html = await missing.text();
  assertPrivateContactAbsent(html);
  assert.ok(/<meta name="robots" content="noindex"/.test(html), "404 is excluded from indexing");
  assert.ok(/Back to the work/.test(html), "404 has a recovery link");
  for (const path of [
    "/content/master-resume.txt",
    "/content/photos",
    "/.claude/agents",
    "/.codex",
    "/.git/config",
    "/.env.local",
    "/audit-evidence-2026-11-26/PORTFOLIO-AUDIT.md",
    "/remediation-evidence/REMEDIATION-REPORT.md",
    "/portfolio-audit-evidence-2026-11-26.zip",
  ]) {
    assert.equal((await request(path)).status, 404, path);
  }
  const resume = await request("/Nathanael_Kim_Resume.pdf");
  assert.equal(resume.status, 200);
  assert.match(resume.headers.get("content-type") ?? "", /application\/pdf/i);
  assert.equal(
    Buffer.from(await resume.arrayBuffer())
      .subarray(0, 5)
      .toString(),
    "%PDF-",
  );
  for (const [path, type] of [
    ["/opengraph-image", "image/png"],
    ["/icon.svg", "image/svg+xml"],
  ]) {
    const asset = await request(path);
    assert.equal(asset.status, 200, path);
    assert.match(asset.headers.get("content-type") ?? "", new RegExp(type.replace("+", "\\+")), path);
  }
});
