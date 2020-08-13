# Viral - Explore COVID-19 data in the United States

[This app](https://ekenes.github.io/covid19viz/) visualizes COVID-19 data in the United States on the county level.

Data originates from a hosted FeatureLayer, which updates daily based on [this data](https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series) maintained by Johns Hopkins University.

The data contains the total number of people who tested positive for COVID-19 and the total number of deaths for each county on a daily basis. These values exist in one column per day as pipe separated values (e.g. a value of `393|14`, indicates the county reported an accumulated total of 393 cases of COVID-19 and 14 deaths as a result of COVID-19).

This app uses expressions to calculate various statistics, such as the total number of cases, new cases, deaths, death rate, doubling time, and the estimated number of people actively sick with COVID-19.

Use the slider to view how this data changed over time.

## Methodology

The methodology that determined the Arcade expressions and cartographic decisions are described in this blog post:
[Animate and explore COVID-19 data through time](https://www.esri.com/arcgis-blog/products/js-api-arcgis/mapping/animate-and-explore-covid-19-data-through-time/).

## Expressions

The following documents each visualization presented in the app along with the expressions used to create the variables driving the renderer for each.

## Get the raw values

All Arcade expressions parse the cases and deaths as numbers from a single string field
that separates each value with a pipe `|` character.

```js
// value is "5082|27" or 5,082 cases and 27 deaths
var currentDayValue = $feature["DAYSTRING_08_04_2020"];

// returns [ "5082", "27" ]
var parts = Split(currentDayValue, "|");

// returns 5082
var cases = Number(parts[0]);
// returns 27
var deaths = Number(parts[1]);

// returns 372909
var population = $feature.POPULATION;
```

In each of the following expressions one or more of these values are parsed and used in the calculation of new variables.

## Total cases

The total number of reported cases to date. After [parsing] the cases value, return it.

```js
return cases;
```

## Total deaths

The total number of reported deaths to date. After [parsing] the deaths value, return it.

```js
return deaths;
```

## Total cases per 100k

The total reported cases to date per 100,000 people.

```js
return (cases / population ) * 100000;
```

## Deaths as a percentage of cases

Returns the percentage of cases that result in death.

```js
return IIF(cases <= 0, 0, (deaths / cases) * 100);
```

## New cases

The 7-day rolling average of new cases reported per day.

The value of `currentDayValueCases` is the equivalent of `cases` above (i.e. the number of cases today). And the `previousDayValueCases`
is the number of cases reported `unit` days ago.

```js
return Round((currentDayValueCases - previousDayValueCases) / unit);
```

### Full expression

```js
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
```

## Doubling time

The time it took for cases to double in number up to the current day. For example, a doubling time of 7 days means that the number of cases 7 days ago was half of what it is today.

```js
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
```

## Active cases

The estimated number of people who are actively sick. Since this number is not reliably counted, we can estimate it using a formula from the CDC, explained and documented [here](https://www.arcgis.com/home/item.html?id=a16bb8b137ba4d8bbe645301b80e5740). The CDC estimates the number of active cases using the following formula:

`Active Cases = (100% of new cases from last 14 days + 19% of days 15-25 + 5% of days 26-49) - deaths`

```js
var activeEstimate = (currentDayInfections - daysAgo14Infections)
  + ( 0.19 * ( daysAgo15Infections - daysAgo25Infections ) )
  + ( 0.05 * ( daysAgo26Infections - daysAgo49Infections) )
  - deaths;

return Round(activeEstimate);
```

## Active cases per 100k

The estimated number of people actively sick per 100,000 people.

```js
return (activeEstimate / population ) * 100000;
```

## Density of cases

One dot represents 10 cases. `Active` cases in red, `recovered` cases in blue, and `deaths` in black.

```js
// Estimate of the number of people who recovered
var recoveredEstimate = Round(cases - activeEstimate - deaths);
```

## Create a field name for a given date

Append this function to the start of an expression if data from multiple fields (dates) is required (e.g. required for active case estimate).

```ts
function getFieldFromDateFunction (){
  return `
    function getFieldFromDate(d) {
      var fieldName = "${prefix}" + Text(d, "MM${separator}DD${separator}Y");
      return fieldName;
    }

  `;
}
```

## Difference between two dates

Generates an expression that calculates the difference between two expressions.

```ts
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
```

## Percent change between two dates

Generates an expression that calculates the percent change of a variable between two dates.

```ts
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
```

[parsing]: readme.md#get-the-raw-values