import fs from "fs";
import fetch from "node-fetch";

const USERNAME = "vialaenzo";
const KEYWORDS = ["42"]; // mots-clés

async function getRepos() {
  const res = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100`);
  return res.json();
}

// Récupérer les techs (langages) d'un repo
async function getRepoLanguages(repo) {
  const res = await fetch(repo.languages_url);
  const data = await res.json();
  return Object.keys(data).join(", ") || "-";
}

function generateTable(reposWithTechs) {
  let table = "| Projet | Description | Techs |\n";
  table += "|--------|-------------|-------|\n";

  reposWithTechs.forEach(({ repo, techs }) => {
    table += `| [${repo.name}](${repo.html_url}) | ${
      repo.description || "Aucune description"
    } | ${techs} |\n`;
  });

  return table;
}

async function main() {
  const repos = await getRepos();

  // Filtrer sur les mots-clés
  let filtered = repos
    .filter((repo) =>
      KEYWORDS.some((k) => repo.name.toLowerCase().includes(k.toLowerCase()))
    )
    // Trier par date de mise à jour (les plus récents en premier)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    // Prendre les 5 derniers
    .slice(0, 5);

  // Récupérer les techs pour chaque repo
  const reposWithTechs = await Promise.all(
    filtered.map(async (repo) => ({
      repo,
      techs: await getRepoLanguages(repo),
    }))
  );

  const table = generateTable(reposWithTechs);

  // Charger README
  let readme = fs.readFileSync("README.md", "utf-8");

  // Remplacer contenu entre balises
  const newReadme = readme.replace(
    /<!-- PROJECTS:START -->([\s\S]*?)<!-- PROJECTS:END -->/,
    `<!-- PROJECTS:START -->\n${table}\n<!-- PROJECTS:END -->`
  );

  fs.writeFileSync("README.md", newReadme);

  console.log("README mis à jour avec les projets récents !");
}

main();
