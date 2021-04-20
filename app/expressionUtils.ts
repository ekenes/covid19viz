export function createNewCasesAverageExpression(currentDateFieldName: string, excludeGetFieldFromDate?: boolean){
  const getFieldFromDate = getFieldFromDateFunction();

  const base = `
    var unit = 7;
    var currentDayValueCases = $feature.Confirmed_${currentDateFieldName};
    var currentDayValueDeaths = $feature.Deaths_${currentDateFieldName};

    var stamp = "${currentDateFieldName}";
    var y = Number( Left(stamp, 4) );
    var m = Number( Mid(stamp, 4, 2) );
    var d = Number( Right(stamp, 2) );
    var currentDayFieldDate = Date(y,m-1,d);
    var previousDay = DateAdd(currentDayFieldDate, (-1 * unit), 'days');
    if (Month(previousDay) == 0 && Day(previousDay) <= 21 && Year(previousDay) == 2020){
      return 0;
    }

    var previousDayFieldName = getFieldFromDate(previousDay);
    var previousDayValueCases = $feature["Confirmed_" + previousDayFieldName];
    var previousDayValueDeaths = $feature["Deaths_" + previousDayFieldName];

    return Round((currentDayValueCases - previousDayValueCases) / unit);
  `;

  return excludeGetFieldFromDate ? base : getFieldFromDate + base;
}

export function createNewCasesExpression(currentDateFieldName: string, excludeGetFieldFromDate?: boolean){
  const getFieldFromDate = getFieldFromDateFunction();

  const base = `
    var unit = 7;
    var currentDayValueCases = $feature.Confirmed_${currentDateFieldName};

    var stamp = "${currentDateFieldName}";
    var y = Number( Left(stamp, 4) );
    var m = Number( Mid(stamp, 4, 2) );
    var d = Number( Right(stamp, 2) );
    var currentDayFieldDate = Date(y,m-1,d);
    var previousDay = DateAdd(currentDayFieldDate, (-1 * unit), 'days');
    if (Month(previousDay) == 0 && Day(previousDay) <= 21 && Year(previousDay) == 2020){
      return 0;
    }

    var previousDayFieldName = getFieldFromDate(previousDay);
    var previousDayValueCases = $feature["Confirmed_" + previousDayFieldName];

    return (currentDayValueCases - previousDayValueCases);
  `;

  return excludeGetFieldFromDate ? base : getFieldFromDate + base;
}

export function createActiveCasesExpression(currentDateFieldName: string, excludeGetFieldFromDate?: boolean){
  const getFieldFromDate = getFieldFromDateFunction();

  const base = `
    var currentDayCases = $feature.Confirmed_${currentDateFieldName};
    var currentDayDeaths = $feature.Deaths_${currentDateFieldName};

    var stamp = "${currentDateFieldName}";
    var y = Number( Left(stamp, 4) );
    var m = Number( Mid(stamp, 4, 2) );
    var d = Number( Right(stamp, 2) );
    var currentDayFieldDate = Date(y,m-1,d);

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
    var daysAgo14Cases = $feature["Confirmed_" + daysAgo14FieldName];
    var daysAgo14Deaths = $feature["Deaths_" + daysAgo14FieldName];

    var daysAgo15FieldName = getFieldFromDate(daysAgo15);
    var daysAgo15Cases = $feature["Confirmed_" + daysAgo15FieldName];
    var daysAgo15Deaths = $feature["Deaths_" + daysAgo15FieldName];

    if (daysAgo26 < startDate){
      return Round( (currentDayCases - daysAgo14Cases) + ( 0.19 * daysAgo15Cases ) - deaths );
    }

    var daysAgo25FieldName = getFieldFromDate(daysAgo25);
    var daysAgo25Cases = $feature["Confirmed_" + daysAgo25FieldName];
    var daysAgo25Deaths = $feature["Deaths_" + daysAgo25FieldName];

    var daysAgo26FieldName = getFieldFromDate(daysAgo26);
    var daysAgo26Cases = $feature["Confirmed_" + daysAgo26FieldName];
    var daysAgo26Deaths = $feature["Deaths_" + daysAgo26FieldName];

    if (daysAgo49 < startDate){
      return Round( (currentDayCases - daysAgo14Cases) + ( 0.19 * ( daysAgo15Cases - daysAgo25Cases ) ) + ( 0.05 * daysAgo26Cases ) - deaths );
    }

    var daysAgo49FieldName = getFieldFromDate(daysAgo49);
    var daysAgo49Cases = $feature["Confirmed_" + daysAgo49FieldName];
    var daysAgo49Deaths = $feature["Deaths_" + daysAgo49FieldName];

    deaths = currentDayDeaths - daysAgo49Deaths;
    var activeEstimate = (currentDayCases - daysAgo14Cases) + ( 0.19 * ( daysAgo15Cases - daysAgo25Cases ) ) + ( 0.05 * ( daysAgo26Cases - daysAgo49Cases) ) - deaths;

    return Round(activeEstimate);
  `;

  return excludeGetFieldFromDate ? base : getFieldFromDate + base;
}

export function createRecoveredCasesExpression(currentDateFieldName: string, excludeGetFieldFromDate?: boolean){
  const getFieldFromDate = getFieldFromDateFunction();

  const base = `
    var currentDayCases = $feature.Confirmed_${currentDateFieldName};
    var currentDayDeaths = $feature.Deaths_${currentDateFieldName};

    var stamp = "${currentDateFieldName}";
    var y = Number( Left(stamp, 4) );
    var m = Number( Mid(stamp, 4, 2) );
    var d = Number( Right(stamp, 2) );
    var currentDayFieldDate = Date(y,m-1,d);

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
    var daysAgo14Cases = $feature["Confirmed_" + daysAgo14FieldName];
    var daysAgo14Deaths = $feature["Deaths_" + daysAgo14FieldName];

    var daysAgo15FieldName = getFieldFromDate(daysAgo15);
    var daysAgo15Cases = $feature["Confirmed_" + daysAgo15FieldName];
    var daysAgo15Deaths = $feature["Deaths_" + daysAgo15FieldName];

    if (daysAgo26 < startDate){
      return Round( (currentDayCases - daysAgo14Cases) + ( 0.19 * daysAgo15Cases ) - deaths );
    }

    var daysAgo25FieldName = getFieldFromDate(daysAgo25);
    var daysAgo25Cases = $feature["Confirmed_" + daysAgo25FieldName];
    var daysAgo25Deaths = $feature["Deaths_" + daysAgo25FieldName];


    var daysAgo26FieldName = getFieldFromDate(daysAgo26);
    var daysAgo26Cases = $feature["Confirmed_" + daysAgo26FieldName];
    var daysAgo26Deaths = $feature["Deaths_" + daysAgo26FieldName];

    if (daysAgo49 < startDate){
      return Round( (currentDayCases - daysAgo14Cases) + ( 0.19 * ( daysAgo15Cases - daysAgo25Cases ) ) + ( 0.05 * daysAgo26Cases ) - deaths );
    }

    var daysAgo49FieldName = getFieldFromDate(daysAgo49);
    var daysAgo49Cases = $feature["Confirmed_" + daysAgo49FieldName];
    var daysAgo49Deaths = $feature["Deaths_" + daysAgo49FieldName];

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
    var totalCasesValue = $feature.Confirmed_${currentDateFieldName};

    var stamp = "${currentDateFieldName}";
    var y = Number( Left(stamp, 4) );
    var m = Number( Mid(stamp, 4, 2) );
    var d = Number( Right(stamp, 2) );
    var currentDayFieldDate = Date(y,m-1,d);
    var previousDay = DateAdd(currentDayFieldDate, (-1 * unit), 'days');
    if (Month(previousDay) == 0 && Day(previousDay) <= 21 && Year(previousDay) == 2020){
      return 0;
    }

    var previousDayFieldName = getFieldFromDate(previousDay);
    var previousDayCasesValue = $feature["Confirmed_" + previousDayFieldName];

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
    var cases = $feature.Confirmed_${currentDateFieldName};
    var population = $feature.POP2018;
    return (cases / population ) * 100000;
  `;
}

export function createDeathRate100kExpression(currentDateFieldName: string){
  return `
    var deaths = $feature.Deaths_${currentDateFieldName};
    var population = $feature.POP2018;
    return (deaths / population ) * 100000;
  `;
}

export function createActiveCasesPer100kExpression(currentDateFieldName: string, excludeGetFieldFromDate?: boolean){
  const getFieldFromDate = getFieldFromDateFunction();

  const base = `
    var population = $feature.POP2018;

    var currentDayCases = $feature.Confirmed_${currentDateFieldName};
    var currentDayDeaths = $feature.Deaths_${currentDateFieldName};

    var stamp = "${currentDateFieldName}";
    var y = Number( Left(stamp, 4) );
    var m = Number( Mid(stamp, 4, 2) );
    var d = Number( Right(stamp, 2) );
    var currentDayFieldDate = Date(y,m-1,d);

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
    var daysAgo14Cases = $feature["Confirmed_" + daysAgo14FieldName];
    var daysAgo14Deaths = $feature["Deaths_" + daysAgo14FieldName];

    var daysAgo15FieldName = getFieldFromDate(daysAgo15);
    var daysAgo15Cases = $feature["Confirmed_" + daysAgo15FieldName];
    var daysAgo15Deaths = $feature["Deaths_" + daysAgo15FieldName];

    if (daysAgo26 < startDate){
      activeEstimate = Round( (currentDayCases - daysAgo14Cases) + ( 0.19 * daysAgo15Cases ) - deaths );
      return (activeEstimate / population ) * 100000;
    }

    var daysAgo25FieldName = getFieldFromDate(daysAgo25);
    var daysAgo25Cases = $feature["Confirmed_" + daysAgo25FieldName];
    var daysAgo25Deaths = $feature["Deaths_" + daysAgo25FieldName];

    var daysAgo26FieldName = getFieldFromDate(daysAgo26);
    var daysAgo26Cases = $feature["Confirmed_" + daysAgo26FieldName];
    var daysAgo26Deaths = $feature["Deaths_" + daysAgo26FieldName];

    if (daysAgo49 < startDate){
      activeEstimate = Round( (currentDayCases - daysAgo14Cases) + ( 0.19 * ( daysAgo15Cases - daysAgo25Cases ) ) + ( 0.05 * daysAgo26Cases ) - deaths );
      return (activeEstimate / population ) * 100000;
    }

    var daysAgo49FieldName = getFieldFromDate(daysAgo49);
    var daysAgo49Cases = $feature["Confirmed_" + daysAgo49FieldName];
    var daysAgo49Deaths = $feature["Deaths_" + daysAgo49FieldName];

    deaths = currentDayDeaths - daysAgo49Deaths;
    activeEstimate = (currentDayCases - daysAgo14Cases) + ( 0.19 * ( daysAgo15Cases - daysAgo25Cases ) ) + ( 0.05 * ( daysAgo26Cases - daysAgo49Cases) ) - deaths;

    return (activeEstimate / population ) * 100000;
  `;

  return excludeGetFieldFromDate ? base : getFieldFromDate + base;
}

export function createDeathRateExpression (currentDateFieldName: string){
  return `
    var cases = $feature.Confirmed_${currentDateFieldName};
    var deaths = $feature.Deaths_${currentDateFieldName};

    return IIF(cases <= 0, 0, (deaths / cases) * 100);
  `;
}

export function createTotalDeathsExpression (currentDateFieldName: string){
  return `
    $feature.Deaths_${currentDateFieldName};
  `;
}

export function createTotalCasesExpression (currentDateFieldName: string){
  return `
    $feature.Confirmed_${currentDateFieldName};
  `;
}

export function createSusceptiblePopulationExpression (currentDateFieldName: string){
  return `
    var cases = $feature.Confirmed_${currentDateFieldName};
    var deaths = $feature.Confirmed_${currentDateFieldName};

    var population = $feature.POP2018;

    return population - cases;
  `;
}

function getFieldFromDateFunction (){
  return `
    function getFieldFromDate(d) {
      var fieldName = Text(d, "YMMDD");
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