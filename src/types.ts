export type Version = {
  id: string,
  type: 'snapshot' | 'release',
  url: string,
  time: string,
  releaseTime: string,
};