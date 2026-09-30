// Loads the YAML files in src/data at build time.
import { load } from 'js-yaml';
import profileRaw from '../data/profile.yml?raw';
import linksRaw from '../data/links.yml?raw';
import aboutRaw from '../data/about.yml?raw';
import projectsRaw from '../data/projects.yml?raw';
import experienceRaw from '../data/experience.yml?raw';
import skillsRaw from '../data/skills.yml?raw';
import postsRaw from '../data/posts.yml?raw';

export interface Profile {
  name: string; first_name: string; initials: string; role: string;
  location: string; intro: string; email?: string;
}
export interface Link { name: string; url: string; icon: string }
export interface Tile {
  title: string; emoji: string;
  color: 'sun' | 'mint' | 'rose' | 'sky' | 'lilac';
  size?: 'wide' | 'tall' | 'normal';
  text?: string; items?: string[];
}
export interface Project {
  name: string; url: string; repo?: string; role: string;
  language: string; stars?: number; description: string;
}
export interface Job { role: string; company: string; period: string; points?: string[] }
export interface Skills {
  certifications: { name: string; issuer: string; status?: string; url?: string }[];
  stack: { group: string; items: string[] }[];
}
export interface ExternalPost { title: string; url: string; date?: string | Date; minutes?: number; where: string }

const y = <T>(raw: string) => load(raw) as T;

export const profile = y<Profile>(profileRaw);
export const links = y<Link[]>(linksRaw);
export const about = y<Tile[]>(aboutRaw);
export const projects = y<Project[]>(projectsRaw);
export const experience = y<Job[]>(experienceRaw);
export const skills = y<Skills>(skillsRaw);
export const externalPosts = y<ExternalPost[]>(postsRaw);
