import { infectionsPopulationLayer2020 } from "./layerUtils";
import { dateAdd, getFieldFromDate } from "./timeUtils";

export const dataOverlap: any = {};

export async function fetchFinalYearOfData(){
  const startDate = new Date(2020, 10, 1);
  const endDate = new Date(2020, 11, 31);

  const query = infectionsPopulationLayer2020.createQuery();
  query.where = "1=1";
  query.maxRecordCountFactor = 5;
  query.returnGeometry = false;

  const { features } = await infectionsPopulationLayer2020.queryFeatures(query);

  for (let i = 0; i < features.length; i++){
    if(!features[i] || !features[i].attributes){
      break;
    }
    const fips = features[i].attributes.FIPS;
    dataOverlap[fips] = {};

    for( let d = startDate; d < endDate; d = dateAdd(d, 1) ){
      const dateFieldName = getFieldFromDate(d);
      const confirmed = `Confirmed_${dateFieldName}`;
      const deaths = `Deaths_${dateFieldName}`;

      dataOverlap[fips][confirmed] = features[i].attributes[confirmed];
      dataOverlap[fips][deaths] = features[i].attributes[deaths];
    }

  }

  return dataOverlap;
}