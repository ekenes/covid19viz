import FeatureLayer = require("esri/layers/FeatureLayer");
import Graphic = require("esri/Graphic");
import { getFieldFromDate, dateAdd } from "./timeUtils";

interface StatisticsParams {
  layer: FeatureLayer,
  startDate: Date,
  endDate?: Date
}

let allFeatures: Graphic[] = null;
let allStats = {};

export async function getTotalCases(params: StatisticsParams ){
  const { layer, startDate, endDate } = params;
  const startDateFieldName = getFieldFromDate(startDate);

  if(!allFeatures){
    allFeatures = await queryAllFeatures(layer);
  }

  const totalCount = allFeatures.map( feature => {
    const value: string = feature.attributes[startDateFieldName];
    const cases = parseInt(value.split("|")[0]);
    return cases;
  })
  .reduce( (prev, curr) => prev + curr);
  console.log("total", totalCount);
  return totalCount;
}

export async function getTotalDeaths(params: StatisticsParams ){
  const { layer, startDate, endDate } = params;
  const startDateFieldName = getFieldFromDate(startDate);

  if(!allFeatures){
    allFeatures = await queryAllFeatures(layer);
  }

  const totalCount = allFeatures.map( feature => {
    const value: string = feature.attributes[startDateFieldName];
    const cases = parseInt(value.split("|")[1]);
    return cases;
  })
  .reduce( (prev, curr) => prev + curr);

  return totalCount;
}

async function queryAllFeatures(layer: FeatureLayer){
  const { features } = await layer.queryFeatures({
    returnGeometry: false,
    outFields: ["*"],
    maxRecordCountFactor: 5,
    where: "1=1"
  });
  return features;
}

export async function getStatsForDate( params: StatisticsParams ){
  const { layer, startDate, endDate } = params;

  let totalCases = 0;
  let totalDeaths = 0;
  let totalRecovered = 0;
  let totalActive = 0;
  let totalPopulation = 0;

  const startDateFieldName = getFieldFromDate(startDate);

  if (allStats[startDateFieldName]){
    return allStats[startDateFieldName];
  }

  const daysAgo14 = dateAdd(startDate, -14);
  const daysAgo15 = dateAdd(startDate, -15);
  const daysAgo25 = dateAdd(startDate, -25);
  const daysAgo26 = dateAdd(startDate, -26);
  const daysAgo49 = dateAdd(startDate, -49);

  if(!allFeatures){
    allFeatures = await queryAllFeatures(layer);
  }

  allFeatures.forEach( feature => {
    const value: string = feature.attributes[startDateFieldName];
    if(!value){
      return;
    }
    const currentDayInfections = parseInt(value.split("|")[0]);
    const currentDayDeaths = parseInt(value.split("|")[1]);

    const startDate = new Date(2020, 0, 22);
    let deathCount = currentDayDeaths;
    let activeEstimate = 0;

    if (daysAgo15 < startDate){
      activeEstimate = currentDayInfections - deathCount;
    } else {

      const daysAgo14FieldName = getFieldFromDate(daysAgo14);
      const daysAgo14Value = feature.attributes[daysAgo14FieldName] || "0|0";
      const daysAgo14Infections = parseInt(daysAgo14Value.split("|")[0]);

      const daysAgo15FieldName = getFieldFromDate(daysAgo15);
      const daysAgo15Value = feature.attributes[daysAgo15FieldName] || "0|0";
      const daysAgo15Infections = parseInt(daysAgo15Value.split("|")[0]);

      if (daysAgo26 < startDate){
        activeEstimate = Math.round( (currentDayInfections - daysAgo14Infections) + ( 0.19 * daysAgo15Infections ) - deathCount );
      } else {

        const daysAgo25FieldName = getFieldFromDate(daysAgo25);
        const daysAgo25Value = feature.attributes[daysAgo25FieldName] || "0|0";
        const daysAgo25Infections = parseInt(daysAgo25Value.split("|")[0]);

        const daysAgo26FieldName = getFieldFromDate(daysAgo26);
        const daysAgo26Value = feature.attributes[daysAgo26FieldName] || "0|0";
        const daysAgo26Infections = parseInt(daysAgo26Value.split("|")[0]);

        if (daysAgo49 < startDate){
          activeEstimate = Math.round( (currentDayInfections - daysAgo14Infections) + ( 0.19 * ( daysAgo15Infections - daysAgo25Infections ) ) + ( 0.05 * daysAgo26Infections ) - deathCount );
        } else {

          const daysAgo49FieldName = getFieldFromDate(daysAgo49);
          const daysAgo49Value = feature.attributes[daysAgo49FieldName] || "0|0";
          const daysAgo49Infections = parseInt(daysAgo49Value.split("|")[0]);
          const daysAgo49Deaths = parseInt(daysAgo49Value.split("|")[1]);

          deathCount = currentDayDeaths - daysAgo49Deaths;

          // Active Cases = (100% of new cases from last 14 days + 19% of days 15-25 + 5% of days 26-49) - Death Count
          activeEstimate = Math.round((currentDayInfections - daysAgo14Infections) + ( 0.19 * ( daysAgo15Infections - daysAgo25Infections ) ) + ( 0.05 * ( daysAgo26Infections - daysAgo49Infections) ) - deathCount);
        }
      }
    }
    const recoveredEstimate = Math.round(currentDayInfections - activeEstimate - currentDayDeaths);

    totalCases += currentDayInfections;
    totalDeaths += currentDayDeaths;
    totalActive += activeEstimate;
    totalRecovered += recoveredEstimate;
    totalPopulation += feature.attributes.POPULATION;
  });

  const stats = {
    cases: totalCases,
    deaths: totalDeaths,
    active: totalActive,
    recovered: totalRecovered,
    activeRate: (totalActive / totalPopulation ) * 100000,
    recoveredRate: (totalRecovered / totalPopulation ) * 100000,
    deathRate: (totalDeaths / totalPopulation ) * 100000,
  };

  allStats[startDateFieldName] = stats;
  return stats;
}

export async function getStats(params: StatisticsParams){
  const { layer, startDate, endDate } = params;

  const startStats = await getStatsForDate({
    layer,
    startDate
  });

  if(endDate){
    const endStats = await getStatsForDate({
      layer,
      startDate: endDate
    });

    const diffStats = {
      cases: endStats.cases - startStats.cases,
      deaths: endStats.deaths - startStats.deaths,
      active: endStats.active - startStats.active,
      recovered: endStats.recovered - startStats.recovered,
      activeRate: endStats.activeRate - startStats.activeRate,
      recoveredRate: endStats.recoveredRate - startStats.recoveredRate,
      deathRate: endStats.deathRate - startStats.deathRate,
    };
    return diffStats;
  } else {
    return startStats;
  }
}
