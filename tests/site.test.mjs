import assert from "node:assert/strict";
import { test } from "node:test";

const origin = process.env.TEST_SITE_URL ?? "http://127.0.0.1:3200";
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
    const title = capture(html, /<title>([^<]+)<\/title>/);
    const description = capture(html, /<meta name="description" content="([^"]+)"/);
    assert.ok(title && description, route);
    titles.add(title);
    descriptions.add(description);
    const url = new URL(capture(html, /<link rel="canonical" href="([^"]+)"/));
    assert.equal(url.href, new URL(route, canonical).href);
    assert.doesNotMatch(html, /<meta name="robots" content="[^"]*noindex/i);
    assert.match(html, /<meta property="og:image" content="https:\/\/nathanaelkim\.com\/opengraph-image/);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
    assert.match(html, /<link rel="icon" href="\/icon.svg/);
    assertPrivateContactAbsent(html);
    if (route === "/info") {
      assert.match(html, /Bachelor of Business Administration/);
      assert.match(html, /additional major[^<]{0,40}Computer Science/i);
      assert.ok(
        !/Bachelor of Science|dual degree|UW-Madison/i.test(html),
        "No second degree or hyphenated campus name",
      );
      const data = JSON.parse(capture(html, /<script type="application\/ld\+json">([^<]+)<\/script>/));
      assert.equal(data["@type"], "ProfilePage");
      assert.equal(data.mainEntity["@type"], "Person");
      assert.equal(data.mainEntity.name, "Nathanael Kim");
      assert.equal(data.mainEntity.alternateName, "Nate Kim");
      assert.ok(!("telephone" in data.mainEntity) && !("address" in data.mainEntity));
    }
  }
  assert.equal(titles.size, routes.length);
  assert.equal(descriptions.size, routes.length);
});

test("sitemap, robots and exact redirect contracts", async () => {
  const sitemap = await request("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const locations = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(locations.sort(), routes.map((route) => new URL(route, canonical).href).sort());
  const robots = await request("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap: https:\/\/nathanaelkim\.com\/sitemap\.xml/);
  const redirect = await request("/orin?source=test");
  assert.equal(redirect.status, 308);
  assert.equal(new URL(redirect.headers.get("location"), origin).pathname, "/work/orin");
  assert.equal(new URL(redirect.headers.get("location"), origin).search, "?source=test");
});

test("404 recovery, public assets and private routes", async () => {
  const missing = await request("/missing-portfolio-regression-route");
  assert.equal(missing.status, 404);
  const html = await missing.text();
  assert.match(html, /<meta name="robots" content="noindex"/);
  assert.match(html, /Back to the work/);
  assertPrivateContactAbsent(html);
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
