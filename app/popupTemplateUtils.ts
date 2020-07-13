import { getFieldFromDate, initialTimeExtent, getNextDay, formatDate } from "./timeUtils";

import PopupTemplate = require("esri/PopupTemplate");
import TextContent = require("esri/popup/content/TextContent");
import MediaContent = require("esri/popup/content/MediaContent");
import FieldInfo = require("esri/popup/FieldInfo");
import ExpressionInfo = require("esri/popup/ExpressionInfo");

import { expressionDifference, createRecoveredCasesExpression, createActiveCasesExpression, createDoublingTimeExpression, createNewInfectionsAverageExpression, createNewInfectionsExpression, createTotalDeathsExpression, createDeathRateExpression, createTotalInfectionsExpression, createInfectionRateExpression, createActiveCasesPer100kExpression } from "./expressionUtils";
import { UpdateRendererParams } from "./rendererUtils";
import { FieldsContent } from "esri/popup/content";

interface PopupTemplateUpdateParams extends UpdateRendererParams {
  existingTemplate?: PopupTemplate
}

interface PopupTemplateCreateParams {
  currentDate: Date,
  existingTemplate?: PopupTemplate
}

export function updatePopupTemplate (params: PopupTemplateUpdateParams) {
  const { currentDate, rendererType, existingTemplate, layer } = params;
  let popupTemplate: PopupTemplate;

  switch (rendererType) {
    case "total-infections":
      popupTemplate = createTotalCasesPopupTemplate({
        currentDate,
        existingTemplate
      });
      break;
    case "total-deaths":
      popupTemplate = createTotalDeathsPopupTemplate({
        currentDate,
        existingTemplate
      });
      break;
    case "total-active":
      popupTemplate = createActiveCasesPopupTemplate({
        currentDate,
        existingTemplate
      });
      break;
    case "doubling-time":
      popupTemplate = createNewInfectionsPopupTemplate({
        currentDate,
        existingTemplate
      });
      break;
    case "death-rate":
      popupTemplate = createDeathRatePopupTemplate({
        currentDate,
        existingTemplate
      });
      break;
    case "active-rate":
      popupTemplate = createActiveRatePopupTemplate({
        currentDate,
        existingTemplate
      });
      break;
    case "infection-rate-per-100k":
      popupTemplate = createInfectionRatePopupTemplate({
        currentDate,
        existingTemplate
      });
      break;
    case "new-total":
      popupTemplate = createNewInfectionsPopupTemplate({
        currentDate,
        existingTemplate
      });
    case "dot-density":
      popupTemplate = createSIRsPopupTemplate({
        currentDate,
        existingTemplate
      })
    default:
      break;
  }

  layer.popupTemplate = popupTemplate;
}

function createInfectionFieldList(startDate: Date, endDate: Date){
  const infectionFieldList = [];

  let currentDate = startDate;

  while (currentDate <= endDate){
    infectionFieldList.push(getFieldFromDate(currentDate));
    currentDate = getNextDay(currentDate);
  }
  return infectionFieldList;
}

function createTotalCasesExpressionInfos(startDate: Date, endDate: Date): ExpressionInfo[] {
  const expressionInfos: ExpressionInfo[] = [];

  let currentDate = startDate;

  while (currentDate <= endDate){
    const currentFieldName = getFieldFromDate(currentDate);
    expressionInfos.push( new ExpressionInfo({
      expression: createTotalInfectionsExpression(currentFieldName),
      name: `total-infections-${currentFieldName}`,
      title: formatDate(currentDate)
    }));
    currentDate = getNextDay(currentDate);
  }
  return expressionInfos;
}

function createTotalDeathsExpressionInfos(startDate: Date, endDate: Date): ExpressionInfo[] {
  const expressionInfos: ExpressionInfo[] = [];

  let currentDate = startDate;

  while (currentDate <= endDate){
    const currentFieldName = getFieldFromDate(currentDate);

    expressionInfos.push( new ExpressionInfo({
      expression: createTotalDeathsExpression(currentFieldName),
      name: `total-deaths-${currentFieldName}`,
      title: formatDate(currentDate)
    }));
    currentDate = getNextDay(currentDate);
  }
  return expressionInfos;
}

function createTotalCasesPopupTemplate(params: PopupTemplateCreateParams) : PopupTemplate{
  const { currentDate, existingTemplate } = params;

  const currentFieldName = getFieldFromDate(currentDate);

  if(existingTemplate){
    existingTemplate.content[0] = new TextContent({
      text: `<b>{expression/total-infections-${currentFieldName}}</b> people tested positive for COVID-19 as of ${formatDate(currentDate)}.`
    });
    return existingTemplate.clone();
  }

  const expressionInfos = createTotalCasesExpressionInfos(initialTimeExtent.start, initialTimeExtent.end);
  const expressionNameList = expressionInfos.map( expressionInfo => `expression/${expressionInfo.name}` );

  const expressionFieldInfos = expressionNameList.map(function(name:string){
    return {
      fieldName: name,
      format: {
        places: 0,
        digitSeparator: true
      }
    };
  });

  return new PopupTemplate({
    title: `{Admin2}, {Province_State}, {Country_Region}`,
    outFields: ["*"],
    content: [
      new TextContent({
        text: `<b>{expression/total-infections-${currentFieldName}}</b> people tested positive for COVID-19 as of ${formatDate(currentDate)}.`
      }),
      new MediaContent({
        mediaInfos: [{
          type: "line-chart",
          title: "Total cases over time",
          value: {
            fields: expressionNameList
          }
        }]
      })
    ],
    fieldInfos: expressionFieldInfos,
    expressionInfos
  });
}

function createTotalDeathsPopupTemplate(params: PopupTemplateCreateParams) : PopupTemplate{
  const { currentDate, existingTemplate } = params;

  const currentFieldName = getFieldFromDate(currentDate);

  if(existingTemplate){
    existingTemplate.content[0] = new TextContent({
      text: `<b>{expression/total-deaths-${currentFieldName}}</b> people died from COVID-19 as of ${formatDate(currentDate)}.`
    });
    return existingTemplate.clone();
  }

  const expressionInfos = createTotalDeathsExpressionInfos(initialTimeExtent.start, initialTimeExtent.end);
  const expressionNameList = expressionInfos.map( expressionInfo => `expression/${expressionInfo.name}` );

  const expressionFieldInfos = expressionNameList.map(function(name:string){
    return {
      fieldName: name,
      format: {
        places: 0,
        digitSeparator: true
      }
    };
  });

  return new PopupTemplate({
    title: `{Admin2}, {Province_State}, {Country_Region}`,
    outFields: ["*"],
    content: [
      new TextContent({
        text: `<b>{expression/total-deaths-${currentFieldName}}</b> people died from COVID-19 as of ${formatDate(currentDate)}.`
      }),
      new MediaContent({
        mediaInfos: [{
          type: "line-chart",
          title: "COVID-19 deaths",
          value: {
            fields: expressionNameList
          }
        }]
      })
    ],
    fieldInfos: expressionFieldInfos,
    expressionInfos
  });
}

function createActiveCasesPopupTemplate(params: PopupTemplateCreateParams) : PopupTemplate{
  const { currentDate, existingTemplate } = params;

  const currentFieldName = getFieldFromDate(currentDate);

  if(existingTemplate){
    existingTemplate.content[0] = new TextContent({
      text: `An estimated <b>{expression/${currentFieldName}}</b> people were actively sick with COVID-19 on ${formatDate(currentDate)}.`
    });
    return existingTemplate.clone();
  }

  const expressionInfos = createActiveCasesExpressionInfos(initialTimeExtent.start, initialTimeExtent.end);
  const expressionNameList = expressionInfos.map( expressionInfo => `expression/${expressionInfo.name}` );

  const expressionFieldInfos = expressionNameList.map(function(name:string){
    return {
      fieldName: name,
      format: {
        places: 0,
        digitSeparator: true
      }
    };
  });

  return new PopupTemplate({
    title: `{Admin2}, {Province_State}, {Country_Region}`,
    outFields: ["*"],
    content: [
      new TextContent({
        text: `An estimated <b>{expression/${currentFieldName}}</b> people were actively sick with COVID-19 on ${formatDate(currentDate)}.`
      }),
      new MediaContent({
        mediaInfos: [{
          type: "line-chart",
          title: "Active cases by day",
          value: {
            fields: expressionNameList
          }
        }]
      })
    ],
    fieldInfos: expressionFieldInfos.concat([new FieldInfo({
      fieldName: currentFieldName,
      format: {
        places: 0,
        digitSeparator: true
      }
    })]),
    expressionInfos
  });
}

function createActiveCasesExpressionInfos(startDate: Date, endDate: Date): ExpressionInfo[] {
  const expressionInfos: ExpressionInfo[] = [];

  let currentDate = startDate;

  while (currentDate <= endDate){
    const currentFieldName = getFieldFromDate(currentDate);
    expressionInfos.push( new ExpressionInfo({
      expression: createActiveCasesExpression(currentFieldName),
      name: currentFieldName,
      title: formatDate(currentDate)
    }));
    currentDate = getNextDay(currentDate);
  }
  return expressionInfos;
}

function createDoublingTimePopupTemplate(params: PopupTemplateCreateParams) : PopupTemplate {
  const { currentDate, existingTemplate } = params;

  const currentFieldName = getFieldFromDate(currentDate);

  if(existingTemplate){
    existingTemplate.content[0] = new TextContent({
      text: `<b>{expression/new-infections}</b> people tested positive for COVID-19 in the last 7 days.
        The number of new cases has a doubling time of <b>{expression/doubling-time} days</b>.
        `
    });
    existingTemplate.expressionInfos = [ new ExpressionInfo({
      expression: createDoublingTimeExpression(currentFieldName),
      name: "doubling-time",
      title: "doubling time"
    }), new ExpressionInfo({
      expression: createNewInfectionsExpression(currentFieldName),
      name: "new-infections",
      title: "new cases"
    })];
    return existingTemplate.clone();
  }

  const infectionFieldList = createInfectionFieldList(initialTimeExtent.start, initialTimeExtent.end);

  const infectionFieldInfos = infectionFieldList.map(function(name){
    return {
      fieldName: name,
      label: name,
      format: {
        places: 0,
        digitSeparator: true
      }
    };
  });

  return new PopupTemplate({
    title: `{Admin2}, {Province_State}, {Country_Region}`,
    outFields: ["*"],
    content: [
      new TextContent({
        text: `<b>{expression/new-infections}</b> people tested positive for COVID-19 in the last 7 days.
        The number of new cases has a doubling time of <b>{expression/doubling-time} days</b>.
        `
      }),
      new MediaContent({
        mediaInfos: [{
          type: "line-chart",
          title: "Total cases over time",
          value: {
            fields: infectionFieldList
          }
        }]
      })
    ],
    fieldInfos: infectionFieldInfos.concat([
      new FieldInfo({
        fieldName: currentFieldName,
        format: {
          places: 0,
          digitSeparator: true
        }
      }),
      new FieldInfo({
        fieldName: "expression/doubling-time",
        format: {
          places: 0,
          digitSeparator: true
        }
      }),
      new FieldInfo({
        fieldName: "expression/new-infections",
        format: {
          places: 0,
          digitSeparator: true
        }
      })
    ]),
    expressionInfos: [ new ExpressionInfo({
      expression: createDoublingTimeExpression(currentFieldName),
      name: "doubling-time",
      title: "doubling time"
    }), new ExpressionInfo({
      expression: createNewInfectionsExpression(currentFieldName),
      name: "new-infections",
      title: "new cases"
    })]
  });
}

function createNewCasesExpressionInfos(startDate: Date, endDate: Date): ExpressionInfo[] {
  const expressionInfos: ExpressionInfo[] = [];

  let currentDate = startDate;

  while (currentDate <= endDate){
    const currentFieldName = getFieldFromDate(currentDate);
    expressionInfos.push( new ExpressionInfo({
      expression: createNewInfectionsAverageExpression(currentFieldName),
      name: `new-cases-${currentFieldName}`,
      title: formatDate(currentDate)
    }));
    currentDate = getNextDay(currentDate);
  }
  return expressionInfos;
}

function createDoublingTimeExpressionInfos(startDate: Date, endDate: Date): ExpressionInfo[] {
  const expressionInfos: ExpressionInfo[] = [];

  let currentDate = startDate;

  while (currentDate <= endDate){
    const currentFieldName = getFieldFromDate(currentDate);
    expressionInfos.push( new ExpressionInfo({
      expression: createDoublingTimeExpression(currentFieldName),
      name: `doubling-time-${currentFieldName}`,
      title: formatDate(currentDate)
    }));
    currentDate = getNextDay(currentDate);
  }
  return expressionInfos;
}

function createNewInfectionsPopupTemplate(params: PopupTemplateCreateParams) : PopupTemplate {
  const { currentDate, existingTemplate } = params;

  const currentFieldName = getFieldFromDate(currentDate);

  if(existingTemplate){
    existingTemplate.content[0] = new TextContent({
      text: `<b>{expression/new-infections}</b> people tested positive for COVID-19 in the last 7 days.
        The number of new cases has a doubling time of <b>{expression/doubling-time} days</b>.
        `
    });
    const expressionInfosLength = existingTemplate.expressionInfos.length;
    const replacementIndex = expressionInfosLength - 2;
    existingTemplate.expressionInfos.splice(replacementIndex, 2, new ExpressionInfo({
      expression: createDoublingTimeExpression(currentFieldName),
      name: "doubling-time",
      title: "doubling time"
    }), new ExpressionInfo({
      expression: createNewInfectionsExpression(currentFieldName),
      name: "new-infections",
      title: "new cases"
    }));
    return existingTemplate.clone();
  }

  const infectionExpressionInfos = createTotalCasesExpressionInfos(initialTimeExtent.start, initialTimeExtent.end);
  const infectionExpressionNameList = infectionExpressionInfos.map( expressionInfo => `expression/${expressionInfo.name}` );
  const infectionExpressionFieldInfos = infectionExpressionNameList.map(function(name:string){
    return {
      fieldName: name,
      format: {
        places: 0,
        digitSeparator: true
      }
    };
  });

  const newCasesExpressionInfos = createNewCasesExpressionInfos(initialTimeExtent.start, initialTimeExtent.end);
  const newCasesExpressionNameList = newCasesExpressionInfos.map( expressionInfo => `expression/${expressionInfo.name}` );
  const newCasesExpressionFieldInfos = newCasesExpressionNameList.map(function(name:string){
    return {
      fieldName: name,
      format: {
        places: 0,
        digitSeparator: true
      }
    };
  });

  const doublingTimeExpressionInfos = createDoublingTimeExpressionInfos(initialTimeExtent.start, initialTimeExtent.end);
  const doublingTimeExpressionNameList = doublingTimeExpressionInfos.map( expressionInfo => `expression/${expressionInfo.name}` );
  const doublingTimeExpressionFieldInfos = doublingTimeExpressionNameList.map(function(name:string){
    return {
      fieldName: name,
      format: {
        places: 0,
        digitSeparator: true
      }
    };
  });

  return new PopupTemplate({
    title: `{Admin2}, {Province_State}, {Country_Region}`,
    outFields: ["*"],
    content: [
      new TextContent({
        text: `<b>{expression/new-infections}</b> people tested positive for COVID-19 in the last 7 days.
        The number of new cases has a doubling time of <b>{expression/doubling-time} days</b>.
        `
      }),
      new MediaContent({
        mediaInfos: [{
          type: "line-chart",
          title: "Total cases over time",
          value: {
            fields: infectionExpressionNameList
          }
        }, {
          type: "column-chart",
          title: "7-day rolling average of new cases per day",
          value: {
            fields: newCasesExpressionNameList
          }
        }, {
          type: "line-chart",
          title: "Doubling Time (days)",
          value: {
            fields: doublingTimeExpressionNameList
          }
        }]
      })
    ],
    fieldInfos:
      infectionExpressionFieldInfos
      .concat(newCasesExpressionFieldInfos)
      .concat(doublingTimeExpressionFieldInfos)
      .concat([
      new FieldInfo({
        fieldName: currentFieldName,
        format: {
          places: 0,
          digitSeparator: true
        }
      }),
      new FieldInfo({
        fieldName: "expression/doubling-time",
        format: {
          places: 0,
          digitSeparator: true
        }
      }),
      new FieldInfo({
        fieldName: "expression/new-infections",
        format: {
          places: 0,
          digitSeparator: true
        }
      })
    ]),
    expressionInfos:
      infectionExpressionInfos
      .concat(newCasesExpressionInfos)
      .concat(doublingTimeExpressionInfos)
      .concat([ new ExpressionInfo({
        expression: createDoublingTimeExpression(currentFieldName),
        name: "doubling-time",
        title: "doubling time"
      }), new ExpressionInfo({
        expression: createNewInfectionsExpression(currentFieldName),
        name: "new-infections",
        title: "new cases"
      })])
  });
}

function createDeathRatePopupTemplate(params: PopupTemplateCreateParams) : PopupTemplate {
  const { currentDate, existingTemplate } = params;

  const currentFieldName = getFieldFromDate(currentDate);

  if(existingTemplate){
    existingTemplate.content[0] = new TextContent({
      text: `<b>{expression/total-deaths}</b> people died due to COVID-19 here, which represents <b>{expression/death-rate}%</b> of the total number of people infected with the virus.
      `
    });
    existingTemplate.expressionInfos = [ new ExpressionInfo({
      expression: createTotalDeathsExpression(currentFieldName),
      name: "total-deaths",
      title: "total deaths"
    }), new ExpressionInfo({
      expression: createDeathRateExpression(currentFieldName),
      name: "death-rate",
      title: "death rate"
    })];
    return existingTemplate.clone();
  }

  return new PopupTemplate({
    title: `{Admin2}, {Province_State}, {Country_Region}`,
    outFields: ["*"],
    content: [
      new TextContent({
        text: `<b>{expression/total-deaths}</b> people died due to COVID-19 here, which represents <b>{expression/death-rate}%</b> of the total number of people infected with the virus.
        `
      })
    ],
    fieldInfos: [
      new FieldInfo({
        fieldName: currentFieldName,
        format: {
          places: 0,
          digitSeparator: true
        }
      }),
      new FieldInfo({
        fieldName: "expression/total-deaths",
        format: {
          places: 0,
          digitSeparator: true
        }
      }),
      new FieldInfo({
        fieldName: "expression/death-rate",
        format: {
          places: 0,
          digitSeparator: true
        }
      })
    ],
    expressionInfos: [ new ExpressionInfo({
      expression: createTotalDeathsExpression(currentFieldName),
      name: "total-deaths",
      title: "total deaths"
    }), new ExpressionInfo({
      expression: createDeathRateExpression(currentFieldName),
      name: "death-rate",
      title: "death rate"
    })]
  });
}

function createInfectionRatePopupTemplate(params: PopupTemplateCreateParams) : PopupTemplate {
  const { currentDate } = params;

  const currentFieldName = getFieldFromDate(currentDate);

  return new PopupTemplate({
    title: `{Admin2}, {Province_State}, {Country_Region}`,
    outFields: ["*"],
    content: [
      new TextContent({
        text: `<b>{expression/total-infections}</b> out of {POPULATION} people tested positive for COVID-19 here. Positive results ocurred in about <b>{expression/infection-rate}</b> for every 100,000 people.`
      })
    ],
    fieldInfos: [
      new FieldInfo({
        fieldName: "POPULATION",
        format: {
          places: 0,
          digitSeparator: true
        }
      }),
      new FieldInfo({
        fieldName: "expression/infection-rate",
        format: {
          places: 0,
          digitSeparator: true
        }
      }),
      new FieldInfo({
        fieldName: "expression/total-infections",
        format: {
          places: 0,
          digitSeparator: true
        }
      })
    ],
    expressionInfos: [ new ExpressionInfo({
      expression: createInfectionRateExpression(currentFieldName),
      name: "infection-rate",
      title: "Infection rate"
    }), new ExpressionInfo({
      expression: createTotalInfectionsExpression(currentFieldName),
      name: "total-infections",
      title: "Total cases"
    })]
  });
}

function createActiveRatePopupTemplate(params: PopupTemplateCreateParams) : PopupTemplate {
  const { currentDate } = params;

  const currentFieldName = getFieldFromDate(currentDate);

  return new PopupTemplate({
    title: `{Admin2}, {Province_State}, {Country_Region}`,
    outFields: ["*"],
    content: [
      new TextContent({
        text: `An estimated <b>{expression/active-infections}</b> out of {POPULATION} people were sick with COVID-19 on ${formatDate(currentDate)} here. That equates to about <b>{expression/active-rate}</b> cases for every 100,000 people.`
      })
    ],
    fieldInfos: [
      new FieldInfo({
        fieldName: "POPULATION",
        format: {
          places: 0,
          digitSeparator: true
        }
      }),
      new FieldInfo({
        fieldName: "expression/active-rate",
        format: {
          places: 0,
          digitSeparator: true
        }
      }),
      new FieldInfo({
        fieldName: "expression/active-infections",
        format: {
          places: 0,
          digitSeparator: true
        }
      })
    ],
    expressionInfos: [ new ExpressionInfo({
      expression: createActiveCasesPer100kExpression(currentFieldName),
      name: "active-rate",
      title: "Active rate"
    }), new ExpressionInfo({
      expression: createActiveCasesExpression(currentFieldName),
      name: "active-infections",
      title: "Active cases"
    })]
  });
}

function createSIRsPopupTemplate(params: PopupTemplateCreateParams) : PopupTemplate {
  const { currentDate } = params;

  const currentFieldName = getFieldFromDate(currentDate);

  return new PopupTemplate({
    title: `{Admin2}, {Province_State}, {Country_Region}`,
    outFields: ["*"],
    content: [
      new TextContent({
        text: `An estimated <b>{expression/active}</b> out of {POPULATION} people were sick with COVID-19 on ${formatDate(currentDate)} here. That equates to about <b>{expression/active-rate}</b> cases for every 100,000 people.`
      }),
      new FieldsContent({
        fieldInfos: [new FieldInfo({
          fieldName: "expression/active",
          format: {
            places: 0,
            digitSeparator: true
          }
        }),
        new FieldInfo({
          fieldName: "expression/recovered",
          format: {
            places: 0,
            digitSeparator: true
          }
        }),
        new FieldInfo({
          fieldName: "expression/deaths",
          format: {
            places: 0,
            digitSeparator: true
          }
        }),
        new FieldInfo({
          fieldName: "expression/total",
          format: {
            places: 0,
            digitSeparator: true
          }
        })]
      })
    ],
    fieldInfos: [
      new FieldInfo({
        fieldName: "POPULATION",
        format: {
          places: 0,
          digitSeparator: true
        }
      }),
      new FieldInfo({
        fieldName: "expression/active",
        format: {
          places: 0,
          digitSeparator: true
        }
      }),
      new FieldInfo({
        fieldName: "expression/recovered",
        format: {
          places: 0,
          digitSeparator: true
        }
      }),
      new FieldInfo({
        fieldName: "expression/deaths",
        format: {
          places: 0,
          digitSeparator: true
        }
      }),
      new FieldInfo({
        fieldName: "expression/active-rate",
        format: {
          places: 0,
          digitSeparator: true
        }
      })
    ],
    expressionInfos: [ new ExpressionInfo({
      expression: createActiveCasesExpression(currentFieldName),
      name: "active",
      title: "Active cases (est.)"
    }), new ExpressionInfo({
      expression: createRecoveredCasesExpression(currentFieldName),
      name: "recovered",
      title: "Recovered (est.)"
    }), new ExpressionInfo({
      expression: createTotalDeathsExpression(currentFieldName),
      name: "deaths",
      title: "Deaths"
    }), new ExpressionInfo({
      expression: createActiveCasesPer100kExpression(currentFieldName),
      name: "active-rate",
      title: "Active rate"
    }), new ExpressionInfo({
      expression: createTotalInfectionsExpression(currentFieldName),
      name: "total",
      title: "Total cases"
    })]
  });
}