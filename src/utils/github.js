// src/utils/github.js
const owner = 'davisromans';
const repo = 'compliance_hub';
const path = 'projects.json';

export async function getProjects() {
  try {
    const headers = { 'Accept': 'application/vnd.github.v3+json' };
    
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?t=${Date.now()}`, { headers });
    
    if (response.status === 404) return { data: [], sha: null }; 
    if (!response.ok) throw new Error('Failed to fetch projects');

    const file = await response.json();
    const content = decodeURIComponent(escape(atob(file.content)));
    return { data: JSON.parse(content), sha: file.sha };
  } catch (error) {
    console.error("GitHub Fetch Error:", error);
    return { data: [], sha: null };
  }
}

export async function saveProjects(projectsArray, sha) {
  const token = sessionStorage.getItem('github_pat');
  
  if (!token) {
    throw new Error("You are not logged in with a valid GitHub Token.");
  }

  const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(projectsArray, null, 2))));

  const body = {
    message: "Admin CMS: Update projects.json",
    content: contentBase64,
    branch: "main"
  };

  if (sha) body.sha = sha;

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message);
  }

  return await response.json();
}