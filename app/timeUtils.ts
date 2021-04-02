import intl = require("esri/intl");
import TimeExtent = require("esri/TimeExtent");
import lang = require("esri/core/lang");

import { infectionsPopulationLayer, prefix, separator } from "./layerUtils";

export let endDate = getPreviousDay(new Date());

export const initialTimeExtent = {
  start: new Date(2020, 0, 22),
  end: endDate
};

export function getFieldFromDate(d: Date) {
  const fieldName = `${prefix}${("0"+(d.getMonth() + 1)).slice(-2)}${separator}${("0"+d.getDate()).slice(-2)}${separator}${(d.getFullYear()).toString()}`;
  return fieldName;
}

export function getPreviousDay(d: Date){
  return new Date(lang.clone(d).setDate(d.getDate() - 1));
}

export function getNextDay(d: Date){
  return new Date(lang.clone(d).setDate(d.getDate() + 1));
}

export function dateAdd(d: Date, days: number){
  return new Date(lang.clone(d).setDate(d.getDate() + days));
}

export function formatDate(d: Date){
  return intl.formatDate(d, intl.convertDateFormatToIntlOptions("short-date"));
}

export const timeExtents = {
  beforeCA: new TimeExtent({
    start: initialTimeExtent.start,
    end: new Date(2020, 2, 20)
  }),
  afterCA: new TimeExtent({
    start: new Date(2020, 2, 20),
    end: initialTimeExtent.end
  }),
  memorial: new TimeExtent({
    start: new Date(2020, 4, 25),
    end: initialTimeExtent.end
  }),
  july4: new TimeExtent({
    start: new Date(2020, 6, 4),
    end: initialTimeExtent.end
  }),
  sturgis: new TimeExtent({
    start: new Date(2020, 7, 7),
    end: initialTimeExtent.end
  }),
  labor: new TimeExtent({
    start: new Date(2020, 8, 7),
    end: initialTimeExtent.end
  }),
  thanksgiving: new TimeExtent({
    start: new Date(2020, 10, 26),
    end: initialTimeExtent.end
  }),
  christmas: new TimeExtent({
    start: new Date(2020, 11, 25),
    end: initialTimeExtent.end
  }),
  newyears: new TimeExtent({
    start: new Date(2021, 0, 1),
    end: initialTimeExtent.end
  }),
  month: new TimeExtent({
    start: dateAdd(initialTimeExtent.end, -30),
    end: initialTimeExtent.end
  }),
  twoWeeks: new TimeExtent({
    start: dateAdd(initialTimeExtent.end, -14),
    end: initialTimeExtent.end
  }),
}

export async function setEndDate(d?: Date){

  let latestDate = d;
  if(!d){
    const query = infectionsPopulationLayer.createQuery();
    // query.where = "FIPS = '06037'";
    query.objectIds = [ 1 ];
    query.returnGeometry = false;
    const { features } = await infectionsPopulationLayer.queryFeatures(query);
    const feature = features[0];

    latestDate = new Date();
    let latestDateFieldName = getFieldFromDate(latestDate);

    while ( !feature.attributes[latestDateFieldName] ){
      latestDate = getPreviousDay(latestDate);
      latestDateFieldName = getFieldFromDate(latestDate);
    }
  }

  endDate = latestDate;
  initialTimeExtent.end = endDate;
  timeExtents.afterCA.end = endDate;
  timeExtents.beforeCA.end = endDate;
  timeExtents.july4.end = endDate;
  timeExtents.labor.end = endDate;
  timeExtents.memorial.end = endDate;
  timeExtents.month.start = dateAdd(initialTimeExtent.end, -30);
  timeExtents.month.end = endDate;
  timeExtents.sturgis.end = endDate;
  timeExtents.twoWeeks.start = dateAdd(initialTimeExtent.end, -14);
  timeExtents.twoWeeks.end = endDate;
}