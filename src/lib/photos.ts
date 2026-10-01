// Photos live in src/assets/photos/. YAML files refer to them by file name,
// with or without extension ("family.jpg" or "family"). Astro resizes them and
// generates AVIF/WebP at build time; GPS and other metadata are not copied over.
const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/photos/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

const base = (p: string) => p.split('/').pop()!.toLowerCase();
const stem = (p: string) => base(p).replace(/\.[^.]+$/, '');

export function photo(name?: string): ImageMetadata | undefined {
  if (!name) return undefined;
  const n = name.toLowerCase();
  const hit = Object.entries(files).find(([p]) => base(p) === n || stem(p) === n);
  if (!hit && import.meta.env.DEV) console.warn(`[photos] src/assets/photos/${name} not found`);
  return hit?.[1].default;
}

export const isLandscape = (img: ImageMetadata) => img.width > img.height;
