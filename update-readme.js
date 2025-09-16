import fs from "fs";
import fetch from "node-fetch";

const USERNAME = "vialaenzo";
const KEYWORDS = ["42", "inception", "api", "front"]; // <-- les mots-clés que tu veux

async function getRepos() {
  const res = await fetch(`https://api.github.com/users/${USERNAME}/repos`);
  return res.json();
}

function generateTable(repos) {
  let table = "| Projet | Description | Techs |\n";
  table += "|--------|-------------|-------|\n";

  repos.forEach((repo) => {
    table += `| [${repo.name}](${repo.html_url}) | ${
      repo.description || "Aucune description"
    } | - |\n`;
  });

  return table;
}

async function main() {
  const repos = await getRepos();

  // Filtrer sur les mots-clés
  const filtered = repos.filter((repo) =>
    KEYWORDS.some((k) => repo.name.toLowerCase().includes(k.toLowerCase()))
  );

  const table = generateTable(filtered);

  // Charger README
  let readme = fs.readFileSync("README.md", "utf-8");

  // Remplacer contenu entre balises
  const newReadme = readme.replace(
    /<!-- PROJECTS:START -->([\s\S]*?)<!-- PROJECTS:END -->/,
    `<!-- PROJECTS:START -->\n${table}\n<!-- PROJECTS:END -->`
  );

  fs.writeFileSync("README.md", newReadme);
}

main();
