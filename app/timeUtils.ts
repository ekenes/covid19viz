import intl = require("esri/intl");
import TimeExtent = require("esri/TimeExtent");
import lang = require("esri/core/lang");

import { prefix, separator } from "./layerUtils";

export const endDate = getPreviousDay(new Date());

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
  month: new TimeExtent({
    start: dateAdd(initialTimeExtent.end, -30),
    end: initialTimeExtent.end
  }),
  twoWeeks: new TimeExtent({
    start: dateAdd(initialTimeExtent.end, -14),
    end: initialTimeExtent.end
  }),
}