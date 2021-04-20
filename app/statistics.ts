import FeatureLayerView = require("esri/views/layers/FeatureLayerView");
import StatisticDefinition = require("esri/tasks/support/StatisticDefinition");
import { getFieldFromDate, dateAdd, initialTimeExtent } from "./timeUtils";

interface StatisticsParams {
  layerView: FeatureLayerView,
  startDate: Date,
  endDate?: Date
}

let allStats = {};

export async function getStatsForDate( params: StatisticsParams ){
  const { layerView, startDate, endDate } = params;
  const initialDate = initialTimeExtent.start;

  const query = layerView.createQuery();

  const startDateFieldName = getFieldFromDate(startDate);

  if (allStats[startDateFieldName]){
    return allStats[startDateFieldName];
  }

  const totalCasesDefinition = new StatisticDefinition({
    onStatisticField: `Confirmed_${startDateFieldName}`,
    outStatisticFieldName: "cases",
    statisticType: "sum"
  });

  const totalDeathsDefinition = new StatisticDefinition({
    onStatisticField: `Deaths_${startDateFieldName}`,
    outStatisticFieldName: "deaths",
    statisticType: "sum"
  });

  const totalPopulationDefinition = new StatisticDefinition({
    onStatisticField: `POP2018`,
    outStatisticFieldName: "population",
    statisticType: "sum"
  });

  const totalActiveDefinition = new StatisticDefinition({
    outStatisticFieldName: "active",
    statisticType: "sum"
  });

  const daysAgo14 = dateAdd(startDate, -14);
  const daysAgo15 = dateAdd(startDate, -15);
  const daysAgo25 = dateAdd(startDate, -25);
  const daysAgo26 = dateAdd(startDate, -26);
  const daysAgo49 = dateAdd(startDate, -49);

  if(daysAgo15 < initialDate){
    totalActiveDefinition.onStatisticField = `Confirmed_${startDateFieldName} - Deaths_${startDateFieldName}`;
  } else {

    const daysAgo14Infections = `Confirmed_${getFieldFromDate(daysAgo14)}`;
    const daysAgo15Infections = `Confirmed_${getFieldFromDate(daysAgo15)}`;

    if(daysAgo26 < initialDate){
      totalActiveDefinition.onStatisticField = `(Confirmed_${startDateFieldName} - ${daysAgo14Infections}) + ( 0.19 * ${daysAgo15Infections}) - Deaths_${startDateFieldName}`;
    } else {
      const daysAgo25Infections = `Confirmed_${getFieldFromDate(daysAgo25)}`;
      const daysAgo26Infections = `Confirmed_${getFieldFromDate(daysAgo26)}`;

      if(daysAgo49 < initialDate){
        totalActiveDefinition.onStatisticField = `(Confirmed_${startDateFieldName} - ${daysAgo14Infections}) + ( 0.19 * (${daysAgo15Infections} - ${daysAgo25Infections})) + ( 0.05 * ${daysAgo26Infections} ) - Deaths_${startDateFieldName}`;
      } else {
        const daysAgo49Infections = `Confirmed_${getFieldFromDate(daysAgo49)}`;
        const daysAgo49Deaths = `Deaths_${getFieldFromDate(daysAgo49)}`;

        const deathCount = `(Deaths_${startDateFieldName} - ${daysAgo49Deaths})`;

        // Active Cases = (100% of new cases from last 14 days + 19% of days 15-25 + 5% of days 26-49) - Death Count
        totalActiveDefinition.onStatisticField = `(Confirmed_${startDateFieldName} - ${daysAgo14Infections}) + ( 0.19 * (${daysAgo15Infections} - ${daysAgo25Infections})) + ( 0.05 * (${daysAgo26Infections} - ${daysAgo49Infections})) - ${deathCount}`;
      }
    }
  }

  query.outFields = ["*"];
  query.returnGeometry = false;
  query.where = "1=1";
  query.outStatistics = [
    totalCasesDefinition,
    totalDeathsDefinition,
    totalPopulationDefinition,
    totalActiveDefinition
  ];

  const { features } = await layerView.queryFeatures(query);

  const {
    cases,
    deaths,
    active,
    population
  } = features[0].attributes;

  const recovered = cases - active - deaths;
  const stats = {
    cases,
    deaths,
    active,
    recovered,
    activeRate: (active / population ) * 100000,
    recoveredRate: (recovered / population ) * 100000,
    deathRate: (deaths / population ) * 100000,
  };

  allStats[startDateFieldName] = stats;
  return stats;
}

export async function getStats(params: StatisticsParams){
  const { layerView, startDate, endDate } = params;

  const startStats = await getStatsForDate({
    layerView,
    startDate
  });

  if(endDate){
    const endStats = await getStatsForDate({
      layerView,
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
