'use strict';

const findSectorName = /^(.+?) :/;
const findSubsectorName = /^.+? : (.+)$/;

function hasSubsectors(sectorName) {
  return sectorName.indexOf(' : ') >= 0;
}

function getSectorName(sectorName) {
  const results = findSectorName.exec(sectorName);
  return results && results[1];
}

function getSubsectorName(sectorName) {
  return sectorName.replace(findSubsectorName, '$1');
}

module.exports = function(allSectors) {
  const sectors = {};
  const subsectors = {};

  function getSectorsAsArray(){
    return Object.keys(sectors).map(key => sectors[key]);
  }

  for (const sector of allSectors ){
    const sectorHasSubsectors = hasSubsectors( sector.name );
    const sectorName = ( sectorHasSubsectors ? getSectorName( sector.name ) : sector.name );
    let sectorId;

    if (sectorHasSubsectors) {
      // key by name because it is the only consistent thing
      if (typeof sectors[sectorName] === 'undefined') {
        sectors[sectorName] = {
          id: sector.id,
          name: sectorName,
          subsectors: 0
        };
      }

      sectorId = sectors[sectorName].id;

      if (typeof subsectors[sectorId] === 'undefined') {
        subsectors[sectorId] = [];
      }

      sectors[sectorName].subsectors++;

      subsectors[sectorId].push({
        id: sector.id,
        name: getSubsectorName(sector.name)
      });

    } else {

      sectors[sectorName] = sector;
    }
  }

  return {sectors: getSectorsAsArray(), subsectors};
};
