export type Version = {
  id: string,
  type: 'snapshot' | 'release',
  url: string,
  time: string,
  releaseTime: string,
};

export type MojangMappings = {
  obfuscated: string,
  mapped: string;
  type: string | 'class' | 'method' | 'field';
};

export type Mappings = 'mojang' | 'mcp';
