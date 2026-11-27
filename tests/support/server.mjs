// The site under test. With TEST_SITE_URL set, that server is used as it is. Otherwise
// `next start` serves the existing production build on a free local port, and stop()
// ends it together with any child processes.
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../..", import.meta.url));
const windows = process.platform === "win32";

function freePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.on("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

/** Resolves with the site's origin once it answers; `stop` is safe to call more than once. */
export async function startSite() {
  if (process.env.TEST_SITE_URL) {
    return { origin: new URL(process.env.TEST_SITE_URL).origin, stop: async () => {} };
  }
  if (!existsSync(new URL("../../.next/BUILD_ID", import.meta.url))) {
    throw new Error("No production build in .next. Run `npm run build` first, or set TEST_SITE_URL.");
  }

  const port = await freePort();
  const origin = `http://127.0.0.1:${port}`;
  const next = createRequire(import.meta.url).resolve("next/dist/bin/next");
  const child = spawn(process.execPath, [next, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    // Its own process group on Linux and macOS, so stop() reaches its children too.
    detached: !windows,
    windowsHide: true,
  });
  let log = "";
  const keep = (chunk) => (log = (log + chunk).slice(-4000));
  child.stdout.on("data", keep);
  child.stderr.on("data", keep);
  const exited = new Promise((resolve) => child.once("exit", resolve));
  const running = () => child.exitCode === null && child.signalCode === null;

  function kill(signal) {
    if (!running()) return;
    if (windows) spawnSync("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore" });
    else {
      try {
        process.kill(-child.pid, signal);
      } catch {
        // The group is already gone.
      }
    }
  }
  // If the tests end abruptly, take the server down with them.
  const killNow = () => kill("SIGKILL");
  const interrupt = (signal) => () => {
    killNow();
    process.exit(signal === "SIGINT" ? 130 : 143);
  };
  const onInt = interrupt("SIGINT");
  const onTerm = interrupt("SIGTERM");
  process.on("exit", killNow);
  process.once("SIGINT", onInt);
  process.once("SIGTERM", onTerm);

  async function stop() {
    process.off("exit", killNow);
    process.off("SIGINT", onInt);
    process.off("SIGTERM", onTerm);
    kill("SIGTERM");
    const timer = setTimeout(killNow, 5000);
    await exited;
    clearTimeout(timer);
  }

  const deadline = Date.now() + 60_000;
  while (true) {
    if (!running()) {
      await stop();
      throw new Error(`next start exited (code ${child.exitCode}):\n${log}`);
    }
    try {
      const response = await fetch(origin, { redirect: "manual", signal: AbortSignal.timeout(2000) });
      await response.body?.cancel();
      return { origin, stop };
    } catch {
      if (Date.now() > deadline) {
        await stop();
        throw new Error(`next start did not answer on ${origin} within 60 s:\n${log}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
}
