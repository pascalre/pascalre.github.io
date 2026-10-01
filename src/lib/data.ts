// Loads the YAML files in src/data at build time.
import { load } from 'js-yaml';
import profileRaw from '../data/profile.yml?raw';
import linksRaw from '../data/links.yml?raw';
import aboutRaw from '../data/about.yml?raw';
import projectsRaw from '../data/projects.yml?raw';
import experienceRaw from '../data/experience.yml?raw';
import skillsRaw from '../data/skills.yml?raw';
import postsRaw from '../data/posts.yml?raw';
import legalRaw from '../data/legal.yml?raw';

export interface Profile {
  name: string; first_name: string; initials: string; role: string;
  location: string; intro: string; email?: string;
}
export interface Link { name: string; url: string; icon: string }
export interface Tile {
  title?: string; emoji?: string;
  /** Photo tile: the image fills the tile, title/text sit on top of it */
  photo?: string; alt?: string; position?: string;
  color?: 'sun' | 'mint' | 'rose' | 'sky' | 'lilac';
  size?: 'wide' | 'tall' | 'normal';
  text?: string; items?: string[];
}
export interface Project {
  name: string; url: string; repo?: string; role: string;
  language: string; stars?: number; description: string;
}
/** A photo in src/assets/photos. `position` is a CSS object-position, e.g. "50% 20%" to keep faces in view. */
export interface PhotoRef { src: string; alt: string; caption?: string; position?: string }
export interface Job { role: string; company: string; logo?: string; period: string; points?: string[]; photos?: PhotoRef[] }
export interface Skills {
  certifications: { name: string; issuer: string; logo?: string; status?: string; url?: string }[];
  /** Items are a name ("Go") or { name, icon } when the logo file has a different name */
  stack: { group: string; items: (string | { name: string; icon?: string })[] }[];
}
export interface Legal { name: string; street: string; city: string; country: string; email: string; updated: string | Date }
export interface ExternalPost { title: string; url: string; date?: string | Date; minutes?: number; where: string; logo?: string }

const y = <T>(raw: string) => load(raw) as T;

export const profile = y<Profile>(profileRaw);
export const links = y<Link[]>(linksRaw);
export const about = y<Tile[]>(aboutRaw);
export const projects = y<Project[]>(projectsRaw);
export const experience = y<Job[]>(experienceRaw);
export const skills = y<Skills>(skillsRaw);
export const externalPosts = y<ExternalPost[]>(postsRaw);
export const legal = y<Legal>(legalRaw);
