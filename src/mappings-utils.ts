import fs from 'fs';

import { MojangMappings, Version } from './types';
import { isCacheExpired } from './utils';

export async function loadMojangMappings(version: Version): Promise<Array<MojangMappings>> {
  const isCached: boolean = isMojangMappingsCached(version.id);
  if (isCached) return JSON.parse(fs.readFileSync(`cache/${version.id}/client_mappings.json`).toString());
  if (!fs.existsSync(`cache/${version.id}`)) fs.mkdirSync(`cache/${version.id}`, { recursive: true });
  const data = await (await fetch(version.url)).json();
  const mappings = await parseMojangMappings(data.downloads.client_mappings.url);
  fs.writeFileSync(`cache/${version.id}/client_mappings.json`, JSON.stringify(mappings));
  return mappings;
}

async function parseMojangMappings(mappings_url: string): Promise<Array<MojangMappings>> {
  const mappings: string[] = (await (await fetch(mappings_url)).text()).split('\n').filter(a => a.includes(' -> '));

  const mapped_mappings: MojangMappings[] = mappings.map(mappings => {
    const mapped: string[] = mappings.split(' -> ');
    const type = mapped[1].endsWith(':') ? 'class' : (mapped[0].includes('(') && mapped[0].includes(')')) || mapped[1] == '<init>' ? 'method' : 'field';

    return {
      mapped: mapped[0],
      obfuscated: type == 'class' ? mapped[1].replace(':', '') : mapped[1],
      type,
    };
  }).filter(a => a != undefined);

  return mapped_mappings;
}

function isMojangMappingsCached(versionId: String): boolean {
  if (!fs.existsSync(`cache/${versionId}`) || !fs.existsSync(`cache/${versionId}/client_mappings.json`)) return false;
  // check if file was created within the past 6 hours
  // invert if statement
  return !isCacheExpired(fs.statSync(`cache/${versionId}/client_mappings.json`).atimeMs, 60 * 6);
}
