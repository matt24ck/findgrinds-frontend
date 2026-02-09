// Irish areas — grouped by county, with subregions for larger counties

export const AREAS = [
  // Carlow
  { value: 'CARLOW', label: 'Carlow', county: 'Carlow' },
  // Cavan
  { value: 'CAVAN', label: 'Cavan', county: 'Cavan' },
  // Clare
  { value: 'CLARE', label: 'Clare', county: 'Clare' },
  // Cork
  { value: 'CORK_CITY', label: 'Cork City', county: 'Cork' },
  { value: 'CORK_NORTH', label: 'North Cork', county: 'Cork' },
  { value: 'CORK_SOUTH', label: 'South Cork', county: 'Cork' },
  { value: 'CORK_EAST', label: 'East Cork', county: 'Cork' },
  { value: 'CORK_WEST', label: 'West Cork', county: 'Cork' },
  // Donegal
  { value: 'DONEGAL_NORTH', label: 'North Donegal', county: 'Donegal' },
  { value: 'DONEGAL_SOUTH', label: 'South Donegal', county: 'Donegal' },
  // Dublin
  { value: 'DUBLIN_CITY', label: 'Dublin City', county: 'Dublin' },
  { value: 'DUBLIN_NORTH', label: 'North Dublin', county: 'Dublin' },
  { value: 'DUBLIN_SOUTH', label: 'South Dublin', county: 'Dublin' },
  { value: 'DUBLIN_WEST', label: 'West Dublin', county: 'Dublin' },
  // Galway
  { value: 'GALWAY_CITY', label: 'Galway City', county: 'Galway' },
  { value: 'GALWAY_EAST', label: 'East Galway', county: 'Galway' },
  { value: 'GALWAY_WEST', label: 'West Galway', county: 'Galway' },
  // Kerry
  { value: 'KERRY_NORTH', label: 'Tralee & North Kerry', county: 'Kerry' },
  { value: 'KERRY_SOUTH', label: 'Killarney & South Kerry', county: 'Kerry' },
  // Kildare
  { value: 'KILDARE', label: 'Kildare', county: 'Kildare' },
  // Kilkenny
  { value: 'KILKENNY', label: 'Kilkenny', county: 'Kilkenny' },
  // Laois
  { value: 'LAOIS', label: 'Laois', county: 'Laois' },
  // Leitrim
  { value: 'LEITRIM', label: 'Leitrim', county: 'Leitrim' },
  // Limerick
  { value: 'LIMERICK_CITY', label: 'Limerick City', county: 'Limerick' },
  { value: 'LIMERICK_COUNTY', label: 'County Limerick', county: 'Limerick' },
  // Longford
  { value: 'LONGFORD', label: 'Longford', county: 'Longford' },
  // Louth
  { value: 'LOUTH', label: 'Louth', county: 'Louth' },
  // Mayo
  { value: 'MAYO_EAST', label: 'East Mayo', county: 'Mayo' },
  { value: 'MAYO_WEST', label: 'West Mayo', county: 'Mayo' },
  // Meath
  { value: 'MEATH', label: 'Meath', county: 'Meath' },
  // Monaghan
  { value: 'MONAGHAN', label: 'Monaghan', county: 'Monaghan' },
  // Offaly
  { value: 'OFFALY', label: 'Offaly', county: 'Offaly' },
  // Roscommon
  { value: 'ROSCOMMON', label: 'Roscommon', county: 'Roscommon' },
  // Sligo
  { value: 'SLIGO', label: 'Sligo', county: 'Sligo' },
  // Tipperary
  { value: 'TIPPERARY_NORTH', label: 'North Tipperary', county: 'Tipperary' },
  { value: 'TIPPERARY_SOUTH', label: 'South Tipperary', county: 'Tipperary' },
  // Waterford
  { value: 'WATERFORD', label: 'Waterford', county: 'Waterford' },
  // Westmeath
  { value: 'WESTMEATH', label: 'Westmeath', county: 'Westmeath' },
  // Wexford
  { value: 'WEXFORD', label: 'Wexford', county: 'Wexford' },
  // Wicklow
  { value: 'WICKLOW', label: 'Wicklow', county: 'Wicklow' },
] as const;

// Lookup: value → label (e.g. 'CORK_CITY' → 'Cork City')
export const AREA_LABELS: Record<string, string> = Object.fromEntries(
  AREAS.map(a => [a.value, a.label])
);

// Group areas by county for <optgroup> rendering
export const AREAS_BY_COUNTY = (() => {
  const grouped: { county: string; areas: { value: string; label: string }[] }[] = [];
  let current: typeof grouped[number] | null = null;

  for (const area of AREAS) {
    if (!current || current.county !== area.county) {
      current = { county: area.county, areas: [] };
      grouped.push(current);
    }
    current.areas.push({ value: area.value, label: area.label });
  }

  return grouped;
})();
