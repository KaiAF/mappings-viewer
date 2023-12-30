import * as fs from 'fs';

import { Version } from "./types";

const MOJANG_VERSION_MANIFEST = 'https://launchermeta.mojang.com/mc/game/version_manifest.json';

export async function getVersions(): Promise<Array<Version>> {
  const versionsManifest = await (await fetch(MOJANG_VERSION_MANIFEST)).json();
  const versions: Array<Version> = versionsManifest.versions;
  fs.writeFileSync('cache/versions.json', JSON.stringify(versions));
  return versions;
}

export function getCachedVersions(): Array<Version> | null {
  if (!fs.existsSync('cache/versions.json')) return null;
  const stats = fs.statSync('cache/versions.json');
  const expired = checkCacheTime(stats.birthtimeMs);
  if (expired) {
    fs.rmSync('cache/versions.json');
    console.log('Versions cache expired.');
    return null;
  }
  return JSON.parse(fs.readFileSync('cache/versions.json').toString());
}

export function checkCacheTime(timeIn: Number): boolean {
  const fiveMinutesAhead: Number = new Date().setMinutes(new Date().getMinutes() + 5);
  return fiveMinutesAhead < timeIn;
}
