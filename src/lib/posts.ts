// Merges three sources into one list of writing:
//   1. posts hosted on this site (src/content/blog/*.md)
//   2. dev.to articles, fetched from the public API at build time
//   3. src/data/posts.yml for articles elsewhere, and as a dev.to fallback
import { getCollection } from 'astro:content';
import { externalPosts } from './data';

export interface PostItem {
  title: string;
  url: string;
  date?: Date;
  minutes?: number;
  where: string;
  /** Logo file name in src/assets/logos (defaults to the platform name) */
  logo?: string;
  local: boolean;
}

/** dev.to usernames to import articles from */
const DEVTO_USERS = ['reitermann'];

interface DevtoArticle {
  title: string;
  url: string;
  published_timestamp?: string;
  published_at?: string;
  reading_time_minutes?: number;
}

async function fetchDevto(): Promise<PostItem[]> {
  const out: PostItem[] = [];
  for (const user of DEVTO_USERS) {
    try {
      const res = await fetch(`https://dev.to/api/articles?username=${user}&per_page=100`, {
        headers: { accept: 'application/vnd.forem.api-v1+json' },
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const articles = (await res.json()) as DevtoArticle[];
      for (const a of articles) {
        out.push({
          title: a.title,
          url: a.url,
          date: new Date(a.published_timestamp ?? a.published_at ?? ''),
          minutes: a.reading_time_minutes,
          where: 'DEV',
          local: false,
        });
      }
      console.log(`[dev.to] imported ${articles.length} articles for ${user}`);
    } catch (err) {
      console.warn(`[dev.to] could not load articles for ${user} (${(err as Error).message}), using posts.yml`);
    }
  }
  return out;
}

async function localPosts(): Promise<PostItem[]> {
  const entries = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return entries.map((e) => ({
    title: e.data.title,
    url: `/blog/${e.id}/`,
    date: e.data.date,
    minutes: Math.max(1, Math.round((e.body ?? '').split(/\s+/).length / 220)),
    where: 'Blog',
    local: true,
  }));
}

/** dev.to URLs change when the username changes, the slug at the end does not */
const key = (url: string) => url.replace(/\/+$/, '').split('/').pop()!.toLowerCase();

let cache: Promise<PostItem[]> | undefined;

export function getAllPosts(): Promise<PostItem[]> {
  cache ??= (async () => {
    const [local, devto] = await Promise.all([localPosts(), fetchDevto()]);
    const fromYaml: PostItem[] = externalPosts.map((p) => ({
      title: p.title,
      url: p.url,
      date: p.date ? new Date(p.date) : undefined,
      minutes: p.minutes,
      where: p.where,
      logo: p.logo,
      local: false,
    }));
    const seen = new Set<string>();
    const merged: PostItem[] = [];
    for (const p of [...local, ...devto, ...fromYaml]) {
      const k = key(p.url);
      if (seen.has(k)) continue;
      seen.add(k);
      merged.push(p);
    }
    // Newest first, undated entries last
    return merged.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
  })();
  return cache;
}

export const formatMonth = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
