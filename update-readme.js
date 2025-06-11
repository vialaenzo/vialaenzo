const fs = require('fs');
const axios = require('axios');

const username = "vialaenzo";
const maxRepos = 3;

async function main() {
  const res = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=${maxRepos}`);
  const repos = res.data;

  let projectSection = "## 📌 Projets récents\n\n";
  projectSection += "| Projet | Description | Techs |\n";
  projectSection += "|--------|-------------|-------|\n";

  for (const repo of repos) {
    projectSection += `| [\`${repo.name}\`](${repo.html_url}) | ${repo.description || "—"} | — |\n`;
  }

  let readme = fs.readFileSync("README.md", "utf8");
  readme = readme.replace(/## 📌 Projets récents[\s\S]*?(?=## |$)/, projectSection);
  fs.writeFileSync("README.md", readme);
}

main();
