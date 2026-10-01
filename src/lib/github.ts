// Fetches GitHub star counts at build time, so visitors' browsers never
// contact GitHub. The daily rebuild keeps the numbers fresh.
// Falls back to the `stars` value in projects.yml if the API is unreachable.
import { projects, type Project } from './data';

export async function withStars(): Promise<Project[]> {
  const token = process.env.GITHUB_TOKEN;
  return Promise.all(projects.map(async (p) => {
    if (!p.repo) return p;
    try {
      const res = await fetch(`https://api.github.com/repos/${p.repo}`, {
        headers: { accept: 'application/vnd.github+json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { stargazers_count: n } = await res.json() as { stargazers_count?: number };
      return typeof n === 'number' ? { ...p, stars: n } : p;
    } catch (err) {
      console.warn(`[github] could not load stars for ${p.repo} (${(err as Error).message}), using projects.yml`);
      return p;
    }
  }));
}
