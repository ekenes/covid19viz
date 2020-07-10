import { prefix, separator } from "./layerUtils";

export function createNewInfectionsAverageExpression(currentDateFieldName: string, excludeGetFieldFromDate?: boolean){
  const getFieldFromDate = getFieldFromDateFunction();

  const base = `
    var unit = 7;
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];
    var currentDayValueParts = Split(currentDayValue, "|");
    var currentDayValueInfections = Number(currentDayValueParts[0]);
    var currentDayValueDeaths = Number(currentDayValueParts[1]);

    var parts = Split(Replace(currentDayFieldName,"${prefix}",""), "${separator}");
    var currentDayFieldDate = Date(Number(parts[2]), Number(parts[0])-1, Number(parts[1]));
    var previousDay = DateAdd(currentDayFieldDate, (-1 * unit), 'days');
    if (Month(previousDay) == 0 && Day(previousDay) <= 21 && Year(previousDay) == 2020){
      return 0;
    }

    var previousDayFieldName = getFieldFromDate(previousDay);
    var previousDayValue = $feature[previousDayFieldName];
    var previousDayValueParts = Split(previousDayValue, "|");
    var previousDayValueInfections = Number(previousDayValueParts[0]);
    var previousDayValueDeaths = Number(previousDayValueParts[1]);

    return Round((currentDayValueInfections - previousDayValueInfections) / unit);
  `;

  return excludeGetFieldFromDate ? base : getFieldFromDate + base;
}

export function createNewInfectionsExpression(currentDateFieldName: string, excludeGetFieldFromDate?: boolean){
  const getFieldFromDate = getFieldFromDateFunction();

  const base = `
    var unit = 7;
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];
    var currentDayValueParts = Split(currentDayValue, "|");
    var currentDayValueInfections = Number(currentDayValueParts[0]);
    var currentDayValueDeaths = Number(currentDayValueParts[1]);

    var parts = Split(Replace(currentDayFieldName,"${prefix}",""), "${separator}");
    var currentDayFieldDate = Date(Number(parts[2]), Number(parts[0])-1, Number(parts[1]));
    var previousDay = DateAdd(currentDayFieldDate, (-1 * unit), 'days');
    if (Month(previousDay) == 0 && Day(previousDay) <= 21 && Year(previousDay) == 2020){
      return 0;
    }

    var previousDayFieldName = getFieldFromDate(previousDay);
    var previousDayValue = $feature[previousDayFieldName];
    var previousDayValueParts = Split(previousDayValue, "|");
    var previousDayValueInfections = Number(previousDayValueParts[0]);
    var previousDayValueDeaths = Number(previousDayValueParts[1]);

    return (currentDayValueInfections - previousDayValueInfections);
  `;

  return excludeGetFieldFromDate ? base : getFieldFromDate + base;
}

export function createActiveCasesExpression(currentDateFieldName: string, excludeGetFieldFromDate?: boolean){
  const getFieldFromDate = getFieldFromDateFunction();

  const base = `
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];
    var currentDayValueParts = Split(currentDayValue, "|");
    var currentDayInfections = Number(currentDayValueParts[0]);
    var currentDayDeaths = Number(currentDayValueParts[1]);

    var parts = Split(Replace(currentDayFieldName,"${prefix}",""), "${separator}");
    var currentDayFieldDate = Date(Number(parts[2]), Number(parts[0])-1, Number(parts[1]));

    // Active Cases = (100% of new cases from last 14 days + 19% of days 15-25 + 5% of days 26-49) - Death Count

    var daysAgo14 = DateAdd(currentDayFieldDate, -14, 'days');
    var daysAgo15 = DateAdd(currentDayFieldDate, -15, 'days');
    var daysAgo25 = DateAdd(currentDayFieldDate, -25, 'days');
    var daysAgo26 = DateAdd(currentDayFieldDate, -26, 'days');
    var daysAgo49 = DateAdd(currentDayFieldDate, -49, 'days');

    var startDate = Date(2020, 0, 22);

    var deaths = currentDayDeaths;

    if (daysAgo15 < startDate){
      return currentDayInfections - deaths;
    }

    var daysAgo14FieldName = getFieldFromDate(daysAgo14);
    var daysAgo14Value = $feature[daysAgo14FieldName];
    var daysAgo14ValueParts = Split(daysAgo14Value, "|");
    var daysAgo14Infections = Number(daysAgo14ValueParts[0]);
    var daysAgo14Deaths = Number(daysAgo14ValueParts[1]);

    var daysAgo15FieldName = getFieldFromDate(daysAgo15);
    var daysAgo15Value = $feature[daysAgo15FieldName];
    var daysAgo15ValueParts = Split(daysAgo15Value, "|");
    var daysAgo15Infections = Number(daysAgo15ValueParts[0]);
    var daysAgo15Deaths = Number(daysAgo15ValueParts[1]);

    if (daysAgo26 < startDate){
      return Round( (currentDayInfections - daysAgo14Infections) + ( 0.19 * daysAgo15Infections ) - deaths );
    }

    var daysAgo25FieldName = getFieldFromDate(daysAgo25);
    var daysAgo25Value = $feature[daysAgo25FieldName];
    var daysAgo25ValueParts = Split(daysAgo25Value, "|");
    var daysAgo25Infections = Number(daysAgo25ValueParts[0]);
    var daysAgo25Deaths = Number(daysAgo25ValueParts[1]);

    var daysAgo26FieldName = getFieldFromDate(daysAgo26);
    var daysAgo26Value = $feature[daysAgo26FieldName];
    var daysAgo26ValueParts = Split(daysAgo26Value, "|");
    var daysAgo26Infections = Number(daysAgo26ValueParts[0]);
    var daysAgo26Deaths = Number(daysAgo26ValueParts[1]);

    if (daysAgo49 < startDate){
      return Round( (currentDayInfections - daysAgo14Infections) + ( 0.19 * ( daysAgo15Infections - daysAgo25Infections ) ) + ( 0.05 * daysAgo26Infections ) - deaths );
    }

    var daysAgo49FieldName = getFieldFromDate(daysAgo49);
    var daysAgo49Value = $feature[daysAgo49FieldName];
    var daysAgo49ValueParts = Split(daysAgo49Value, "|");
    var daysAgo49Infections = Number(daysAgo49ValueParts[0]);
    var daysAgo49Deaths = Number(daysAgo49ValueParts[1]);

    deaths = currentDayDeaths - daysAgo49Deaths;
    var activeEstimate = (currentDayInfections - daysAgo14Infections) + ( 0.19 * ( daysAgo15Infections - daysAgo25Infections ) ) + ( 0.05 * ( daysAgo26Infections - daysAgo49Infections) ) - deaths;

    return Round(activeEstimate);
  `;

  return excludeGetFieldFromDate ? base : getFieldFromDate + base;
}

export function createDoublingTimeExpression (currentDateFieldName: string, excludeGetFieldFromDate?: boolean){
  const getFieldFromDate = getFieldFromDateFunction();

  const base = `
    var unit = 14;
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];
    var currentDayValueParts = Split(currentDayValue, "|");
    var totalInfectionsValue = Number(currentDayValueParts[0]);

    var parts = Split(Replace(currentDayFieldName,"${prefix}",""), "${separator}");
    var currentDayFieldDate = Date(Number(parts[2]), Number(parts[0])-1, Number(parts[1]));
    var previousDay = DateAdd(currentDayFieldDate, (unit * -1), 'days');

    if (Month(previousDay) == 0 && Day(previousDay) <= 21 && Year(previousDay) == 2020){
      return 0;
    }

    var previousDayFieldName = getFieldFromDate(previousDay);
    var previousDayValue = $feature[previousDayFieldName];
    var previousDayValueParts = Split(previousDayValue, "|");
    var previousDayInfectionsValue = Number(previousDayValueParts[0]);

    var newInfections = totalInfectionsValue - previousDayInfectionsValue;
    var oldInfections = totalInfectionsValue - newInfections;

    if(newInfections == 0 || oldInfections == 0){
      return "n/a";
    }

    var doublingTimeDays = Floor(unit / (newInfections / oldInfections))
    return IIF(doublingTimeDays >= 0, doublingTimeDays, "n/a");
  `;

  return excludeGetFieldFromDate ? base : getFieldFromDate + base;
}

export function createNewInfectionPercentTotalExpression (currentDateFieldName: string, excludeGetFieldFromDate?: boolean){
  const getFieldFromDate = getFieldFromDateFunction();

  const base = `
    var currentDayFieldName = "${currentDateFieldName}";
    var totalInfectionsValue = $feature[currentDayFieldName];
    var parts = Split(Replace(currentDayFieldName,"${prefix}",""), "${separator}");
    var currentDayFieldDate = Date(Number(parts[2]), Number(parts[0])-1, Number(parts[1]));
    var previousDay = DateAdd(currentDayFieldDate, -7, 'days');

    if (Month(previousDay) == 0 && Day(previousDay) <= 21 && Year(previousDay) == 2020){
      return 0;
    }

    var lastDate = DateAdd(Now(), -1, 'days');
    var lastDateFieldName = getFieldFromDate(lastDate);
    var lastDateValue = $feature[lastDateFieldName];

    var previousDayFieldName = getFieldFromDate(previousDay);
    var previousDayValue = $feature[previousDayFieldName];

    var newInfections = totalInfectionsValue - previousDayValue;

    return ( newInfections / lastDateValue ) * 100;
  `;

  return excludeGetFieldFromDate ? base : getFieldFromDate + base;
}

export function createInfectionRateExpression(currentDateFieldName: string){
  return `
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];
    var currentDaySplit = Split(currentDayValue, "|");
    var infections = Number(currentDaySplit[0]);
    var deaths = Number(currentDaySplit[1]);
    var population = $feature.POPULATION;
    return (infections / population ) * 100000;
  `;
}

export function createActiveCasesPer100kExpression(currentDateFieldName: string, excludeGetFieldFromDate?: boolean){
  const getFieldFromDate = getFieldFromDateFunction();

  const base = `
    var population = $feature.POPULATION;

    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];
    var currentDayValueParts = Split(currentDayValue, "|");
    var currentDayInfections = Number(currentDayValueParts[0]);
    var currentDayDeaths = Number(currentDayValueParts[1]);

    var parts = Split(Replace(currentDayFieldName,"${prefix}",""), "${separator}");
    var currentDayFieldDate = Date(Number(parts[2]), Number(parts[0])-1, Number(parts[1]));

    // Active Cases = (100% of new cases from last 14 days + 19% of days 15-25 + 5% of days 26-49) - Death Count

    var daysAgo14 = DateAdd(currentDayFieldDate, -14, 'days');
    var daysAgo15 = DateAdd(currentDayFieldDate, -15, 'days');
    var daysAgo25 = DateAdd(currentDayFieldDate, -25, 'days');
    var daysAgo26 = DateAdd(currentDayFieldDate, -26, 'days');
    var daysAgo49 = DateAdd(currentDayFieldDate, -49, 'days');

    var startDate = Date(2020, 0, 22);

    var activeEstimate = 0;
    var deaths = currentDayDeaths;

    if (daysAgo15 < startDate){
      activeEstimate = currentDayInfections - deaths;
      return (activeEstimate / population ) * 100000;
    }

    var daysAgo14FieldName = getFieldFromDate(daysAgo14);
    var daysAgo14Value = $feature[daysAgo14FieldName];
    var daysAgo14ValueParts = Split(daysAgo14Value, "|");
    var daysAgo14Infections = Number(daysAgo14ValueParts[0]);
    var daysAgo14Deaths = Number(daysAgo14ValueParts[1]);

    var daysAgo15FieldName = getFieldFromDate(daysAgo15);
    var daysAgo15Value = $feature[daysAgo15FieldName];
    var daysAgo15ValueParts = Split(daysAgo15Value, "|");
    var daysAgo15Infections = Number(daysAgo15ValueParts[0]);
    var daysAgo15Deaths = Number(daysAgo15ValueParts[1]);

    if (daysAgo26 < startDate){
      activeEstimate = Round( (currentDayInfections - daysAgo14Infections) + ( 0.19 * daysAgo15Infections ) - deaths );
      return (activeEstimate / population ) * 100000;
    }

    var daysAgo25FieldName = getFieldFromDate(daysAgo25);
    var daysAgo25Value = $feature[daysAgo25FieldName];
    var daysAgo25ValueParts = Split(daysAgo25Value, "|");
    var daysAgo25Infections = Number(daysAgo25ValueParts[0]);
    var daysAgo25Deaths = Number(daysAgo25ValueParts[1]);

    var daysAgo26FieldName = getFieldFromDate(daysAgo26);
    var daysAgo26Value = $feature[daysAgo26FieldName];
    var daysAgo26ValueParts = Split(daysAgo26Value, "|");
    var daysAgo26Infections = Number(daysAgo26ValueParts[0]);
    var daysAgo26Deaths = Number(daysAgo26ValueParts[1]);

    if (daysAgo49 < startDate){
      activeEstimate = Round( (currentDayInfections - daysAgo14Infections) + ( 0.19 * ( daysAgo15Infections - daysAgo25Infections ) ) + ( 0.05 * daysAgo26Infections ) - deaths );
      return (activeEstimate / population ) * 100000;
    }

    var daysAgo49FieldName = getFieldFromDate(daysAgo49);
    var daysAgo49Value = $feature[daysAgo49FieldName];
    var daysAgo49ValueParts = Split(daysAgo49Value, "|");
    var daysAgo49Infections = Number(daysAgo49ValueParts[0]);
    var daysAgo49Deaths = Number(daysAgo49ValueParts[1]);

    deaths = currentDayDeaths - daysAgo49Deaths;
    activeEstimate = (currentDayInfections - daysAgo14Infections) + ( 0.19 * ( daysAgo15Infections - daysAgo25Infections ) ) + ( 0.05 * ( daysAgo26Infections - daysAgo49Infections) ) - deaths;

    return (activeEstimate / population ) * 100000;
  `;

  return excludeGetFieldFromDate ? base : getFieldFromDate + base;
}

export function createDeathRateExpression (currentDateFieldName: string){
  return `
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];

    var parts = Split(currentDayValue, "|");

    var infections = Number(parts[0]);
    var deaths = Number(parts[1]);

    return (deaths / infections) * 100;
  `;
}

export function createTotalDeathsExpression (currentDateFieldName: string){
  return `
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];

    var parts = Split(currentDayValue, "|");

    var infections = Number(parts[0]);
    var deaths = Number(parts[1]);

    return deaths;
  `;
}

export function createTotalInfectionsExpression (currentDateFieldName: string){
  return `
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];

    var parts = Split(currentDayValue, "|");

    var infections = Number(parts[0]);
    var deaths = Number(parts[1]);

    return infections;
  `;
}

function getFieldFromDateFunction (){
  return `
    function getFieldFromDate(d) {
      var fieldName = "${prefix}" + Text(d, "MM${separator}DD${separator}Y");
      return fieldName;
    }

  `;
}

export function expressionDifference (startExpression: string, endExpression: string, includeGetFieldFromDate?: boolean){
  const getFieldFromDate = getFieldFromDateFunction();

  const base = `
    function startExpression(){
      ${startExpression}
    }

    function endExpression(){
      ${endExpression}
    }

    return endExpression() - startExpression();
  `

  return includeGetFieldFromDate ? getFieldFromDate + base : base;
}

export function expressionPercentChange (startExpression: string, endExpression: string, includeGetFieldFromDate?: boolean){
  const getFieldFromDate = getFieldFromDateFunction();

  const base = `
    function startExpression(){
      ${startExpression}
    }

    function endExpression(){
      ${endExpression}
    }
    var startValue = startExpression();
    var endValue = endExpression();

    return ( ( endValue - startValue ) / startValue ) * 100;
  `

  return includeGetFieldFromDate ? getFieldFromDate + base : base;
}