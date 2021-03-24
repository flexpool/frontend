import { ApiRegion } from 'src/types/Region.types';

const regionNames: {
  [key in ApiRegion]: string;
} = {
  eu: 'Europe (EU)',
  us: 'United States (US)',
  as: 'Asia Pacific (AS)',
  au: 'Australia (AU)',
  sa: 'South America (SA)',
};

export function formatRegionName(regionId: ApiRegion) {
  const regionName = regionNames[regionId];

  if (regionName === undefined) {
    console.error('Region name for id', regionId, 'not found');
    return `(${regionId.toUpperCase()})`;
  }

  return regionName;
}
