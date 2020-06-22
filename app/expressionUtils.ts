import { prefix, separator } from "./layerUtils";

export function createNewInfectionsAverageExpression(currentDateFieldName: string){
  return `
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

    function getFieldFromDate(d) {
      var fieldName =  "${prefix}" + Text(d, "MM${separator}DD${separator}Y");
      return fieldName;
    }

    var previousDayFieldName = getFieldFromDate(previousDay);
    var previousDayValue = $feature[previousDayFieldName];
    var previousDayValueParts = Split(previousDayValue, "|");
    var previousDayValueInfections = Number(previousDayValueParts[0]);
    var previousDayValueDeaths = Number(previousDayValueParts[1]);

    return Round((currentDayValueInfections - previousDayValueInfections) / unit);
  `;
}

export function createNewInfectionsExpression(currentDateFieldName: string){
  return `
    var unit = 14;
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

    function getFieldFromDate(d) {
      var fieldName =  "${prefix}" + Text(d, "MM${separator}DD${separator}Y");
      return fieldName;
    }

    var previousDayFieldName = getFieldFromDate(previousDay);
    var previousDayValue = $feature[previousDayFieldName];
    var previousDayValueParts = Split(previousDayValue, "|");
    var previousDayValueInfections = Number(previousDayValueParts[0]);
    var previousDayValueDeaths = Number(previousDayValueParts[1]);

    return (currentDayValueInfections - previousDayValueInfections);
  `;
}

export function createActiveCasesExpression(currentDateFieldName: string){
  return `
    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];
    var currentDayValueParts = Split(currentDayValue, "|");
    var currentDayInfections = Number(currentDayValueParts[0]);
    var currentDayDeaths = Number(currentDayValueParts[1]);

    var parts = Split(Replace(currentDayFieldName,"${prefix}",""), "${separator}");
    var currentDayFieldDate = Date(Number(parts[2]), Number(parts[0])-1, Number(parts[1]));

    // Active Cases = (100% of new cases from last 14 days + 19% of days 15-30 + 5% of days 31-56) - Death Count

    var daysAgo14 = DateAdd(currentDayFieldDate, -14, 'days');
    var daysAgo15 = DateAdd(currentDayFieldDate, -15, 'days');
    var daysAgo30 = DateAdd(currentDayFieldDate, -30, 'days');
    var daysAgo31 = DateAdd(currentDayFieldDate, -31, 'days');
    var daysAgo56 = DateAdd(currentDayFieldDate, -56, 'days');

    var startDate = Date(2020, 0, 22);

    var deaths = currentDayDeaths;

    if (daysAgo15 < startDate){
      return currentDayInfections - deaths;
    }

    function getFieldFromDate(d) {
      var fieldName =  "${prefix}" + Text(d, "MM${separator}DD${separator}Y");
      return fieldName;
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

    if (daysAgo31 < startDate){
      return Round( (currentDayInfections - daysAgo14Infections) + ( 0.19 * daysAgo15Infections ) - deaths );
    }

    var daysAgo30FieldName = getFieldFromDate(daysAgo30);
    var daysAgo30Value = $feature[daysAgo30FieldName];
    var daysAgo30ValueParts = Split(daysAgo30Value, "|");
    var daysAgo30Infections = Number(daysAgo30ValueParts[0]);
    var daysAgo30Deaths = Number(daysAgo30ValueParts[1]);

    var daysAgo31FieldName = getFieldFromDate(daysAgo31);
    var daysAgo31Value = $feature[daysAgo31FieldName];
    var daysAgo31ValueParts = Split(daysAgo31Value, "|");
    var daysAgo31Infections = Number(daysAgo31ValueParts[0]);
    var daysAgo31Deaths = Number(daysAgo31ValueParts[1]);

    if (daysAgo56 < startDate){
      return Round( (currentDayInfections - daysAgo14Infections) + ( 0.19 * ( daysAgo15Infections - daysAgo30Infections ) ) + ( 0.05 * daysAgo31Infections ) - deaths );
    }

    var daysAgo56FieldName = getFieldFromDate(daysAgo56);
    var daysAgo56Value = $feature[daysAgo56FieldName];
    var daysAgo56ValueParts = Split(daysAgo56Value, "|");
    var daysAgo56Infections = Number(daysAgo56ValueParts[0]);
    var daysAgo56Deaths = Number(daysAgo56ValueParts[1]);

    deaths = currentDayDeaths - daysAgo56Deaths;
    var activeEstimate = (currentDayInfections - daysAgo14Infections) + ( 0.19 * ( daysAgo15Infections - daysAgo30Infections ) ) + ( 0.05 * ( daysAgo31Infections - daysAgo56Infections) ) - deaths;

    return Round(activeEstimate);
  `;
}

export function createDoublingTimeExpression (currentDateFieldName: string){
  return `
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

    function getFieldFromDate(d) {
      var fieldName =  "${prefix}" + Text(d, "MM${separator}DD${separator}Y");
      return fieldName;
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
}

export function createNewInfectionPercentTotalExpression (currentDateFieldName: string){
  return `
    var currentDayFieldName = "${currentDateFieldName}";
    var totalInfectionsValue = $feature[currentDayFieldName];
    var parts = Split(Replace(currentDayFieldName,"${prefix}",""), "${separator}");
    var currentDayFieldDate = Date(Number(parts[2]), Number(parts[0])-1, Number(parts[1]));
    var previousDay = DateAdd(currentDayFieldDate, -7, 'days');

    if (Month(previousDay) == 0 && Day(previousDay) <= 21 && Year(previousDay) == 2020){
      return 0;
    }

    function getFieldFromDate(d) {
      var fieldName =  "${prefix}" + Text(d, "MM${separator}DD${separator}Y");
      return fieldName;
    }

    var lastDate = DateAdd(Now(), -1, 'days');
    var lastDateFieldName = getFieldFromDate(lastDate);
    var lastDateValue = $feature[lastDateFieldName];

    var previousDayFieldName = getFieldFromDate(previousDay);
    var previousDayValue = $feature[previousDayFieldName];

    var newInfections = totalInfectionsValue - previousDayValue;

    return ( newInfections / lastDateValue ) * 100;
  `;
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

export function createActiveCasesPer100kExpression(currentDateFieldName: string){
  return `
    var population = $feature.POPULATION;

    var currentDayFieldName = "${currentDateFieldName}";
    var currentDayValue = $feature[currentDayFieldName];
    var currentDayValueParts = Split(currentDayValue, "|");
    var currentDayInfections = Number(currentDayValueParts[0]);
    var currentDayDeaths = Number(currentDayValueParts[1]);

    var parts = Split(Replace(currentDayFieldName,"${prefix}",""), "${separator}");
    var currentDayFieldDate = Date(Number(parts[2]), Number(parts[0])-1, Number(parts[1]));

    // Active Cases = (100% of new cases from last 14 days + 19% of days 15-30 + 5% of days 31-56) - Death Count

    var daysAgo14 = DateAdd(currentDayFieldDate, -14, 'days');
    var daysAgo15 = DateAdd(currentDayFieldDate, -15, 'days');
    var daysAgo30 = DateAdd(currentDayFieldDate, -30, 'days');
    var daysAgo31 = DateAdd(currentDayFieldDate, -31, 'days');
    var daysAgo56 = DateAdd(currentDayFieldDate, -56, 'days');

    var startDate = Date(2020, 0, 22);

    var activeEstimate = 0;
    var deaths = currentDayDeaths;

    if (daysAgo15 < startDate){
      activeEstimate = currentDayInfections - deaths;
      return (activeEstimate / population ) * 100000;
    }

    function getFieldFromDate(d) {
      var fieldName =  "${prefix}" + Text(d, "MM${separator}DD${separator}Y");
      return fieldName;
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

    if (daysAgo31 < startDate){
      activeEstimate = Round( (currentDayInfections - daysAgo14Infections) + ( 0.19 * daysAgo15Infections ) - deaths );
      return (activeEstimate / population ) * 100000;
    }

    var daysAgo30FieldName = getFieldFromDate(daysAgo30);
    var daysAgo30Value = $feature[daysAgo30FieldName];
    var daysAgo30ValueParts = Split(daysAgo30Value, "|");
    var daysAgo30Infections = Number(daysAgo30ValueParts[0]);
    var daysAgo30Deaths = Number(daysAgo30ValueParts[1]);

    var daysAgo31FieldName = getFieldFromDate(daysAgo31);
    var daysAgo31Value = $feature[daysAgo31FieldName];
    var daysAgo31ValueParts = Split(daysAgo31Value, "|");
    var daysAgo31Infections = Number(daysAgo31ValueParts[0]);
    var daysAgo31Deaths = Number(daysAgo31ValueParts[1]);

    if (daysAgo56 < startDate){
      activeEstimate = Round( (currentDayInfections - daysAgo14Infections) + ( 0.19 * ( daysAgo15Infections - daysAgo30Infections ) ) + ( 0.05 * daysAgo31Infections ) - deaths );
      return (activeEstimate / population ) * 100000;
    }

    var daysAgo56FieldName = getFieldFromDate(daysAgo56);
    var daysAgo56Value = $feature[daysAgo56FieldName];
    var daysAgo56ValueParts = Split(daysAgo56Value, "|");
    var daysAgo56Infections = Number(daysAgo56ValueParts[0]);
    var daysAgo56Deaths = Number(daysAgo56ValueParts[1]);

    deaths = currentDayDeaths - daysAgo56Deaths;
    activeEstimate = (currentDayInfections - daysAgo14Infections) + ( 0.19 * ( daysAgo15Infections - daysAgo30Infections ) ) + ( 0.05 * ( daysAgo31Infections - daysAgo56Infections) ) - deaths;

    return (activeEstimate / population ) * 100000;
  `;
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