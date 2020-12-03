/*
  Class that maps categorical ID's in the data to individual petals
  on the avalanche rose.
 */
class UACMapper {}

UACMapper.LOW_ELEVATION = 'Below 8,000 ft';
UACMapper.LOW_ELEVATION_IDS = {
    min: 1,
    max: 8,
    all: d3.range(1, 9, 1),
}
UACMapper.MID_ELEVATION = '8,000 - 9,500 ft';
UACMapper.MID_ELEVATION_IDS = {
    min: 9,
    max: 16,
    all: d3.range(9, 17, 1),
}
UACMapper.HIGH_ELEVATION = 'Above 9,500 ft';
UACMapper.HIGH_ELEVATION_IDS = {
    min: 17,
    max: 24,
    all: d3.range(17, 25, 1),
}
UACMapper.CLASSES = [
    {
        'ID': 0,
        'Aspect': 'All Aspects',
        'Elevation': 'All Elevations',
    },
    {
        'ID': 1,
        'Aspect': 'North',
        'Elevation': UACMapper.LOW_ELEVATION
    },
    {
        'ID': 2,
        'Aspect': 'NE',
        'Elevation': UACMapper.LOW_ELEVATION
    },
    {
        'ID': 3,
        'Aspect': 'East',
        'Elevation': UACMapper.LOW_ELEVATION
    },
    {
        'ID': 4,
        'Aspect': 'SE',
        'Elevation': UACMapper.LOW_ELEVATION
    },
    {
        'ID': 5,
        'Aspect': 'South',
        'Elevation': UACMapper.LOW_ELEVATION
    },
    {
        'ID': 6,
        'Aspect': 'SW',
        'Elevation': UACMapper.LOW_ELEVATION
    },
    {
        'ID': 7,
        'Aspect': 'West',
        'Elevation': UACMapper.LOW_ELEVATION
    },
    {
        'ID': 8,
        'Aspect': 'NW',
        'Elevation': UACMapper.LOW_ELEVATION
    },
    {
        'ID': 9,
        'Aspect': 'North',
        'Elevation': UACMapper.MID_ELEVATION
    },
    {
        'ID': 10,
        'Aspect': 'NE',
        'Elevation': UACMapper.MID_ELEVATION
    },
    {
        'ID': 11,
        'Aspect': 'East',
        'Elevation': UACMapper.MID_ELEVATION
    },
    {
        'ID': 12,
        'Aspect': 'SE',
        'Elevation': UACMapper.MID_ELEVATION
    },
    {
        'ID': 13,
        'Aspect': 'South',
        'Elevation': UACMapper.MID_ELEVATION
    },
    {
        'ID': 14,
        'Aspect': 'SW',
        'Elevation': UACMapper.MID_ELEVATION
    },
    {
        'ID': 15,
        'Aspect': 'West',
        'Elevation': UACMapper.MID_ELEVATION
    },
    {
        'ID': 16,
        'Aspect': 'NW',
        'Elevation': UACMapper.MID_ELEVATION
    },
    {
        'ID': 17,
        'Aspect': 'North',
        'Elevation': UACMapper.HIGH_ELEVATION
    },
    {
        'ID': 18,
        'Aspect': 'NE',
        'Elevation': UACMapper.HIGH_ELEVATION
    },
    {
        'ID': 19,
        'Aspect': 'East',
        'Elevation': UACMapper.HIGH_ELEVATION
    },
    {
        'ID': 20,
        'Aspect': 'SE',
        'Elevation': UACMapper.HIGH_ELEVATION
    },
    {
        'ID': 21,
        'Aspect': 'South',
        'Elevation': UACMapper.HIGH_ELEVATION
    },
    {
        'ID': 22,
        'Aspect': 'SW',
        'Elevation': UACMapper.HIGH_ELEVATION
    },
    {
        'ID': 23,
        'Aspect': 'West',
        'Elevation': UACMapper.HIGH_ELEVATION
    },
    {
        'ID': 24,
        'Aspect': 'NW',
        'Elevation': UACMapper.HIGH_ELEVATION
    }
];
UACMapper.ASPECTS = d3.group(UACMapper.CLASSES, d => d['Aspect']);
UACMapper.ELEVATIONS = d3.group(UACMapper.CLASSES, d => d['Elevation']);
