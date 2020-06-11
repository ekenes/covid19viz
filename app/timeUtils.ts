import intl = require("esri/intl");
import { prefix, separator } from "./layerUtils";

export const endDate = getPreviousDay(new Date());//new Date(2020, 4, 31);// getPreviousDay(new Date());

export const initialTimeExtent = {
  start: new Date(2020, 0, 22),
  end: endDate
};

export function getFieldFromDate(d: Date) {
  const fieldName = `${prefix}${("0"+(d.getMonth() + 1)).slice(-2)}${separator}${("0"+d.getDate()).slice(-2)}${separator}${(d.getFullYear()).toString()}`;
  return fieldName;
}

export function getPreviousDay(d: Date){
  return new Date(d.setDate(d.getDate() - 2));
}

export function getNextDay(d: Date){
  return new Date(d.setDate(d.getDate() + 1));
}

export function formatDate(d: Date){
  return intl.formatDate(d, intl.convertDateFormatToIntlOptions("short-date"));
}
