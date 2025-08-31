import fs from "fs";
import path from "path";

const DEV_PATH = "../dev";
const PROD_PATH = "../prod";
const pkg = JSON.parse(await fs.promises.readFile("./package.json", "utf8"));
const VERSION = pkg.version;

const header = `// ==UserScript==
// @name         PMD+
// @namespace    https://github.com/PieroLB/pmd-plus
// @version      ${VERSION}
// @description  Extension qui ajoute des fonctionnalités (timer, pilote automatique et plan dynamique) dans le jeu PMD.
// @author       PieroLB
// @match        https://pmdapp.fr/*
// @match        https://alpha.pmdapp.fr/*
// @icon         https://lh3.googleusercontent.com/dJpt27Lfg0upeK1rRqPk8W5pMv5JAdOVeCIlM28XQ3o_SL-pCIPH51dnZzPY7lcCNf_tWSOkC-4lzTCToIPGDI3vizk=s60
// @license      MIT
// @grant        none
// ==/UserScript==`;

console.log("Building…");

try {
  const files = await fs.promises.readdir(DEV_PATH);
  const jsFiles = files.filter((f) => path.extname(f) === ".js");

  if (!jsFiles.includes("main.js")) {
    throw new Error("ERREUR ! Le fichier /dev/main.js est manquant");
  }

  const promises = jsFiles
    .filter((f) => f !== "main.js")
    .map((f) => fs.promises.readFile(path.join(DEV_PATH, f), "utf8"));
  promises.push(fs.promises.readFile(path.join(DEV_PATH, "main.js"), "utf8"));

  const fileContents = await Promise.all(promises);
  const bundle = header + "\n\n" + fileContents.join("\n");

  await fs.promises.mkdir(PROD_PATH, { recursive: true });
  await fs.promises.writeFile(
    path.join(PROD_PATH, "pmd-plus.user.js"),
    bundle,
    "utf8"
  );

  console.log("✅ Build terminé : prod/pmd-plus.user.js");
} catch (err) {
  console.error("❌ Build échoué :", err);
  process.exit(1);
}
