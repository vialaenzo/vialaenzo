const fs = require("fs");
const axios = require("axios");

const username = "vialaenzo";
const maxRepos = 3;

async function main() {
  const res = await axios.get(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=${maxRepos}`
  );
  const repos = res.data;

  // Construit la nouvelle section "Projets récents"
  let newSection = "## 📌 Projets récents\n\n";
  newSection += "| Projet | Description | Techs |\n";
  newSection += "|--------|-------------|-------|\n";

  for (const repo of repos) {
    newSection += `| [\`${repo.name}\`](${repo.html_url}) | ${repo.description || "—"} | — |\n`;
  }

  // Lis le README existant
  let readme = fs.readFileSync("README.md", "utf8");

  // Remplace dynamiquement la section entre "## 📌 Projets récents" et la section suivante
  const updated = readme.replace(
    /## 📌 Projets récents[\s\S]*?(?=## |\Z)/,
    newSection
  );

  fs.writeFileSync("README.md", updated);
}

main().catch((err) => {
  console.error("Erreur pendant la mise à jour du README :", err);
  process.exit(1);
});
