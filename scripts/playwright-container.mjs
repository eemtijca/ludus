// No Linux mantém o fluxo da imagem oficial; no Windows adapta caminho e rede.
import { spawnSync } from "node:child_process";
const args = process.argv.slice(2);
const windows = process.platform === "win32";
const result = windows
  ? spawnSync(
      "docker",
      [
        "run",
        "--rm",
        "--init",
        "--ipc=host",
        "--network",
        process.env.PLAYWRIGHT_DOCKER_NETWORK || "bridge",
        "-e",
        "HOME=/tmp",
        "-e",
        "PLAYWRIGHT_HTML_OPEN=never",
        "-v",
        `${process.cwd()}:/work`,
        "-w",
        "/work",
        "-e",
        `TEST_BASE_URL=${process.env.TEST_BASE_URL || "http://host.docker.internal:3000"}`,
        "-e",
        "PLAYWRIGHT_SKIP_WEBSERVER=1",
        process.env.PLAYWRIGHT_IMAGE || "mcr.microsoft.com/playwright:v1.63.0-noble",
        // A imagem oficial do Playwright não expõe o binário global; npx resolve o pacote embutido.
        "npx",
        "playwright",
        "test",
        ...args,
      ],
      { stdio: "inherit" },
    )
  : spawnSync("bash", ["tests/playwright-container.sh", ...args], { stdio: "inherit" });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
