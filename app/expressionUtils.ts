import { prefix, separator } from "./layerUtils";

export function createNewCasesAverageExpression(currentDateFieldName: string, excludeGetFieldFromDate?: boolean){
  const getFieldFromDate = getFieldFromDateFunction();

  const base = `
    var unit = 7;
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];
    var currentDayValueParts = Split(currentDayValue, "|");
    var currentDayValueCases = Number(currentDayValueParts[0]);
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
    var previousDayValueCases = Number(previousDayValueParts[0]);
    var previousDayValueDeaths = Number(previousDayValueParts[1]);

    return Round((currentDayValueCases - previousDayValueCases) / unit);
  `;

  return excludeGetFieldFromDate ? base : getFieldFromDate + base;
}

export function createNewCasesExpression(currentDateFieldName: string, excludeGetFieldFromDate?: boolean){
  const getFieldFromDate = getFieldFromDateFunction();

  const base = `
    var unit = 7;
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];
    var currentDayValueParts = Split(currentDayValue, "|");
    var currentDayValueCases = Number(currentDayValueParts[0]);
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
    var previousDayValueCases = Number(previousDayValueParts[0]);
    var previousDayValueDeaths = Number(previousDayValueParts[1]);

    return (currentDayValueCases - previousDayValueCases);
  `;

  return excludeGetFieldFromDate ? base : getFieldFromDate + base;
}

export function createActiveCasesExpression(currentDateFieldName: string, excludeGetFieldFromDate?: boolean){
  const getFieldFromDate = getFieldFromDateFunction();

  const base = `
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];
    var currentDayValueParts = Split(currentDayValue, "|");
    var currentDayCases = Number(currentDayValueParts[0]);
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
      return currentDayCases - deaths;
    }

    var daysAgo14FieldName = getFieldFromDate(daysAgo14);
    var daysAgo14Value = $feature[daysAgo14FieldName];
    var daysAgo14ValueParts = Split(daysAgo14Value, "|");
    var daysAgo14Cases = Number(daysAgo14ValueParts[0]);
    var daysAgo14Deaths = Number(daysAgo14ValueParts[1]);

    var daysAgo15FieldName = getFieldFromDate(daysAgo15);
    var daysAgo15Value = $feature[daysAgo15FieldName];
    var daysAgo15ValueParts = Split(daysAgo15Value, "|");
    var daysAgo15Cases = Number(daysAgo15ValueParts[0]);
    var daysAgo15Deaths = Number(daysAgo15ValueParts[1]);

    if (daysAgo26 < startDate){
      return Round( (currentDayCases - daysAgo14Cases) + ( 0.19 * daysAgo15Cases ) - deaths );
    }

    var daysAgo25FieldName = getFieldFromDate(daysAgo25);
    var daysAgo25Value = $feature[daysAgo25FieldName];
    var daysAgo25ValueParts = Split(daysAgo25Value, "|");
    var daysAgo25Cases = Number(daysAgo25ValueParts[0]);
    var daysAgo25Deaths = Number(daysAgo25ValueParts[1]);

    var daysAgo26FieldName = getFieldFromDate(daysAgo26);
    var daysAgo26Value = $feature[daysAgo26FieldName];
    var daysAgo26ValueParts = Split(daysAgo26Value, "|");
    var daysAgo26Cases = Number(daysAgo26ValueParts[0]);
    var daysAgo26Deaths = Number(daysAgo26ValueParts[1]);

    if (daysAgo49 < startDate){
      return Round( (currentDayCases - daysAgo14Cases) + ( 0.19 * ( daysAgo15Cases - daysAgo25Cases ) ) + ( 0.05 * daysAgo26Cases ) - deaths );
    }

    var daysAgo49FieldName = getFieldFromDate(daysAgo49);
    var daysAgo49Value = $feature[daysAgo49FieldName];
    var daysAgo49ValueParts = Split(daysAgo49Value, "|");
    var daysAgo49Cases = Number(daysAgo49ValueParts[0]);
    var daysAgo49Deaths = Number(daysAgo49ValueParts[1]);

    deaths = currentDayDeaths - daysAgo49Deaths;
    var activeEstimate = (currentDayCases - daysAgo14Cases) + ( 0.19 * ( daysAgo15Cases - daysAgo25Cases ) ) + ( 0.05 * ( daysAgo26Cases - daysAgo49Cases) ) - deaths;

    return Round(activeEstimate);
  `;

  return excludeGetFieldFromDate ? base : getFieldFromDate + base;
}

export function createRecoveredCasesExpression(currentDateFieldName: string, excludeGetFieldFromDate?: boolean){
  const getFieldFromDate = getFieldFromDateFunction();

  const base = `
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];
    var currentDayValueParts = Split(currentDayValue, "|");
    var currentDayCases = Number(currentDayValueParts[0]);
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
      return currentDayCases - deaths;
    }

    var daysAgo14FieldName = getFieldFromDate(daysAgo14);
    var daysAgo14Value = $feature[daysAgo14FieldName];
    var daysAgo14ValueParts = Split(daysAgo14Value, "|");
    var daysAgo14Cases = Number(daysAgo14ValueParts[0]);
    var daysAgo14Deaths = Number(daysAgo14ValueParts[1]);

    var daysAgo15FieldName = getFieldFromDate(daysAgo15);
    var daysAgo15Value = $feature[daysAgo15FieldName];
    var daysAgo15ValueParts = Split(daysAgo15Value, "|");
    var daysAgo15Cases = Number(daysAgo15ValueParts[0]);
    var daysAgo15Deaths = Number(daysAgo15ValueParts[1]);

    if (daysAgo26 < startDate){
      return Round( (currentDayCases - daysAgo14Cases) + ( 0.19 * daysAgo15Cases ) - deaths );
    }

    var daysAgo25FieldName = getFieldFromDate(daysAgo25);
    var daysAgo25Value = $feature[daysAgo25FieldName];
    var daysAgo25ValueParts = Split(daysAgo25Value, "|");
    var daysAgo25Cases = Number(daysAgo25ValueParts[0]);
    var daysAgo25Deaths = Number(daysAgo25ValueParts[1]);

    var daysAgo26FieldName = getFieldFromDate(daysAgo26);
    var daysAgo26Value = $feature[daysAgo26FieldName];
    var daysAgo26ValueParts = Split(daysAgo26Value, "|");
    var daysAgo26Cases = Number(daysAgo26ValueParts[0]);
    var daysAgo26Deaths = Number(daysAgo26ValueParts[1]);

    if (daysAgo49 < startDate){
      return Round( (currentDayCases - daysAgo14Cases) + ( 0.19 * ( daysAgo15Cases - daysAgo25Cases ) ) + ( 0.05 * daysAgo26Cases ) - deaths );
    }

    var daysAgo49FieldName = getFieldFromDate(daysAgo49);
    var daysAgo49Value = $feature[daysAgo49FieldName];
    var daysAgo49ValueParts = Split(daysAgo49Value, "|");
    var daysAgo49Cases = Number(daysAgo49ValueParts[0]);
    var daysAgo49Deaths = Number(daysAgo49ValueParts[1]);

    deaths = currentDayDeaths - daysAgo49Deaths;
    var activeEstimate = (currentDayCases - daysAgo14Cases) + ( 0.19 * ( daysAgo15Cases - daysAgo25Cases ) ) + ( 0.05 * ( daysAgo26Cases - daysAgo49Cases) ) - deaths;

    return Round(currentDayCases - activeEstimate - currentDayDeaths);
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
    var totalCasesValue = Number(currentDayValueParts[0]);

    var parts = Split(Replace(currentDayFieldName,"${prefix}",""), "${separator}");
    var currentDayFieldDate = Date(Number(parts[2]), Number(parts[0])-1, Number(parts[1]));
    var previousDay = DateAdd(currentDayFieldDate, (unit * -1), 'days');

    if (Month(previousDay) == 0 && Day(previousDay) <= 21 && Year(previousDay) == 2020){
      return 0;
    }

    var previousDayFieldName = getFieldFromDate(previousDay);
    var previousDayValue = $feature[previousDayFieldName];
    var previousDayValueParts = Split(previousDayValue, "|");
    var previousDayCasesValue = Number(previousDayValueParts[0]);

    var newCases = totalCasesValue - previousDayCasesValue;
    var oldCases = totalCasesValue - newCases;

    if(newCases == 0 || oldCases == 0){
      return 0;
    }

    var doublingTimeDays = Floor(unit / (newCases / oldCases))
    return IIF(doublingTimeDays >= 0, doublingTimeDays, 0);
  `;

  return excludeGetFieldFromDate ? base : getFieldFromDate + base;
}

export function createCaseRateExpression(currentDateFieldName: string){
  return `
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];
    var currentDaySplit = Split(currentDayValue, "|");
    var cases = Number(currentDaySplit[0]);
    var deaths = Number(currentDaySplit[1]);
    var population = $feature.POPULATION;
    return (cases / population ) * 100000;
  `;
}

export function createDeathRate100kExpression(currentDateFieldName: string){
  return `
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];
    var currentDaySplit = Split(currentDayValue, "|");
    var cases = Number(currentDaySplit[0]);
    var deaths = Number(currentDaySplit[1]);
    var population = $feature.POPULATION;
    return (deaths / population ) * 100000;
  `;
}

export function createActiveCasesPer100kExpression(currentDateFieldName: string, excludeGetFieldFromDate?: boolean){
  const getFieldFromDate = getFieldFromDateFunction();

  const base = `
    var population = $feature.POPULATION;

    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];
    var currentDayValueParts = Split(currentDayValue, "|");
    var currentDayCases = Number(currentDayValueParts[0]);
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
      activeEstimate = currentDayCases - deaths;
      return (activeEstimate / population ) * 100000;
    }

    var daysAgo14FieldName = getFieldFromDate(daysAgo14);
    var daysAgo14Value = $feature[daysAgo14FieldName];
    var daysAgo14ValueParts = Split(daysAgo14Value, "|");
    var daysAgo14Cases = Number(daysAgo14ValueParts[0]);
    var daysAgo14Deaths = Number(daysAgo14ValueParts[1]);

    var daysAgo15FieldName = getFieldFromDate(daysAgo15);
    var daysAgo15Value = $feature[daysAgo15FieldName];
    var daysAgo15ValueParts = Split(daysAgo15Value, "|");
    var daysAgo15Cases = Number(daysAgo15ValueParts[0]);
    var daysAgo15Deaths = Number(daysAgo15ValueParts[1]);

    if (daysAgo26 < startDate){
      activeEstimate = Round( (currentDayCases - daysAgo14Cases) + ( 0.19 * daysAgo15Cases ) - deaths );
      return (activeEstimate / population ) * 100000;
    }

    var daysAgo25FieldName = getFieldFromDate(daysAgo25);
    var daysAgo25Value = $feature[daysAgo25FieldName];
    var daysAgo25ValueParts = Split(daysAgo25Value, "|");
    var daysAgo25Cases = Number(daysAgo25ValueParts[0]);
    var daysAgo25Deaths = Number(daysAgo25ValueParts[1]);

    var daysAgo26FieldName = getFieldFromDate(daysAgo26);
    var daysAgo26Value = $feature[daysAgo26FieldName];
    var daysAgo26ValueParts = Split(daysAgo26Value, "|");
    var daysAgo26Cases = Number(daysAgo26ValueParts[0]);
    var daysAgo26Deaths = Number(daysAgo26ValueParts[1]);

    if (daysAgo49 < startDate){
      activeEstimate = Round( (currentDayCases - daysAgo14Cases) + ( 0.19 * ( daysAgo15Cases - daysAgo25Cases ) ) + ( 0.05 * daysAgo26Cases ) - deaths );
      return (activeEstimate / population ) * 100000;
    }

    var daysAgo49FieldName = getFieldFromDate(daysAgo49);
    var daysAgo49Value = $feature[daysAgo49FieldName];
    var daysAgo49ValueParts = Split(daysAgo49Value, "|");
    var daysAgo49Cases = Number(daysAgo49ValueParts[0]);
    var daysAgo49Deaths = Number(daysAgo49ValueParts[1]);

    deaths = currentDayDeaths - daysAgo49Deaths;
    activeEstimate = (currentDayCases - daysAgo14Cases) + ( 0.19 * ( daysAgo15Cases - daysAgo25Cases ) ) + ( 0.05 * ( daysAgo26Cases - daysAgo49Cases) ) - deaths;

    return (activeEstimate / population ) * 100000;
  `;

  return excludeGetFieldFromDate ? base : getFieldFromDate + base;
}

export function createDeathRateExpression (currentDateFieldName: string){
  return `
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];

    var parts = Split(currentDayValue, "|");

    var cases = Number(parts[0]);
    var deaths = Number(parts[1]);

    return IIF(cases <= 0, 0, (deaths / cases) * 100);
  `;
}

export function createTotalDeathsExpression (currentDateFieldName: string){
  return `
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];

    var parts = Split(currentDayValue, "|");

    var cases = Number(parts[0]);
    var deaths = Number(parts[1]);

    return deaths;
  `;
}

export function createTotalCasesExpression (currentDateFieldName: string){
  return `
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];

    var parts = Split(currentDayValue, "|");

    var cases = Number(parts[0]);
    var deaths = Number(parts[1]);

    return cases;
  `;
}

export function createSusceptiblePopulationExpression (currentDateFieldName: string){
  return `
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];

    var parts = Split(currentDayValue, "|");

    var cases = Number(parts[0]);
    var deaths = Number(parts[1]);

    var population = $feature.POPULATION;

    return population - cases;
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