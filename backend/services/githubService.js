const axios = require("axios");

const getUserFeatures = async (username) => {
  let allRepos = [];
  let page = 1;

  try {
    while (true) {
      const response = await axios.get(
        `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`
      );

      if (response.data.length === 0) 
          break;

      allRepos = [...allRepos, ...response.data];
      page++;
    }
  } catch (err) 
  {
    if (err.response && err.response.status === 404)
      throw new Error("User not found");
    
    throw new Error("GitHub API error");
  }

  if (!allRepos || allRepos.length === 0) 
    throw new Error("No repositories found");

  // 🔥 Use TOTAL values (NOT averages)
  let total_stars = 0;
  let total_forks = 0;
  let total_watchers = 0;
  let total_size = 0;

  allRepos.forEach((repo) => 
    {
    total_stars += repo.stargazers_count || 0;
    total_forks += repo.forks_count || 0;
    total_watchers += repo.watchers_count || 0;
    total_size += repo.size || 0;
  });

  const repo_count = allRepos.length;

  // Optional averages (safe, but not primary)
  const avg_stars = total_stars / repo_count;
  const avg_forks = total_forks / repo_count;
  const avg_size = total_size / repo_count;

  // 🔥 Feature vector (stable now)
  const features = [
    total_stars,
    avg_stars,
    total_forks,
    avg_forks,
    total_watchers,
    avg_size,
    repo_count,
    0, 0, 1, 10
  ];

  if (features.some(f => isNaN(f) || !isFinite(f))) 
    throw new Error("Invalid feature values");
  
  return {
    features,
    stats: {
      stars: total_stars,
      forks: total_forks,
      activity: total_watchers,
      repos: repo_count
    }
  };
};

module.exports = { getUserFeatures };