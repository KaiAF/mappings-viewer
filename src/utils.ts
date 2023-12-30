import * as fs from 'fs';

import { Mappings, MojangMappings, Version } from "./types";
import { loadMojangMappings } from './mappings-utils';

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
  const expired = isCacheExpired(stats.atimeMs);
  if (expired) {
    fs.rmSync('cache/versions.json');
    console.log('Versions cache expired.');
    return null;
  }
  return JSON.parse(fs.readFileSync('cache/versions.json').toString());
}

export async function loadMappings(mappings: Mappings, version: Version): Promise<MojangMappings[] | null> {
  switch (mappings) {
    case 'mojang': {
      return await loadMojangMappings(version);
      break;
    }
    default:
      break;
  }

  return null;
}

/**
 * @param timeIn The time the file was created
 * @param minutesIn the amount of minutes the file was created within
 * @returns if the file is cached
 */
export function isCacheExpired(timeIn: number, minutesIn = 5): boolean {
  const date: Date = new Date(timeIn);
  const minutesAhead: number = date.setMinutes(date.getMinutes() + minutesIn);
  return minutesAhead < Date.now();
}
