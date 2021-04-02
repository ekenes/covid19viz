import SimpleRenderer = require("esri/renderers/SimpleRenderer");
import ColorVariable = require("esri/renderers/visualVariables/ColorVariable");
import SizeVariable = require("esri/renderers/visualVariables/SizeVariable");
import OpacityVariable = require("esri/renderers/visualVariables/OpacityVariable");
import Color = require("esri/Color");
import AttributeColorInfo = require("esri/renderers/support/AttributeColorInfo");

import CSVLayer = require("esri/layers/CSVLayer");
import FeatureLayer = require("esri/layers/FeatureLayer");
import lang = require("esri/core/lang");

import { getFieldFromDate, formatDate } from "./timeUtils";
import { createTotalCasesExpression, createNewCasesAverageExpression, createDoublingTimeExpression, createActiveCasesPer100kExpression, createCaseRateExpression, createActiveCasesExpression, createDeathRateExpression, createTotalDeathsExpression, expressionPercentChange, expressionDifference, createRecoveredCasesExpression, createDeathRate100kExpression } from "./expressionUtils";
import { SimpleLineSymbol, SimpleMarkerSymbol, SimpleFillSymbol } from "esri/symbols";
import { DotDensityRenderer } from "esri/renderers";

export type COVIDRenderer = SimpleRenderer | DotDensityRenderer;

export interface UpdateRendererParams {
  layer: CSVLayer | FeatureLayer,
  rendererType: "total-infections" | "doubling-time" | "total-deaths" | "total-active" |
    "active-rate" | "infection-rate-per-100k" | "death-rate" | "death-rate-per-100k" | "total-color" |
    "new-total" | "total-color-new-total-size" | "dot-density"
  currentDate: Date,
  endDate?: Date
}

const legendNote = document.getElementById("legend-note");

export function updateRenderer(params: UpdateRendererParams){
  const { layer, rendererType, currentDate, endDate } = params;
  const startDate = currentDate;

  let renderer: COVIDRenderer;

  switch (rendererType) {
    case "total-infections":
      renderer = createTotalCasesRenderer({
        startDate,
        endDate
      });
      legendNote.style.display = "none";
      break;
    case "dot-density":
      renderer = createDotDensityRenderer({
        startDate,
        endDate
      });
      legendNote.style.display = "block";
      break;
    case "doubling-time":
      renderer = createDoublingTimeRenderer({
        startDate,
        endDate
      });
      legendNote.style.display = "block";
      break;
    case "total-deaths":
      renderer = createTotalDeathsRenderer({
        startDate,
        endDate
      });
      legendNote.style.display = "none";
      break;
    case "total-active":
      renderer = createActiveCasesRenderer({
        startDate,
        endDate
      });
      legendNote.style.display = "block";
      break;
    case "active-rate":
      renderer = createActiveRateRenderer({
        startDate,
        endDate
      });
      legendNote.style.display = "block";
      break;
    case "infection-rate-per-100k":
      renderer = createCaseRateRenderer({
        startDate,
        endDate
      });
      legendNote.style.display = "none";
      break;
    case "death-rate":
      renderer = createDeathRateRenderer({
        startDate,
        endDate
      });
      legendNote.style.display = "none";
      break;
    case "death-rate-per-100k":
      renderer = createDeaths100kRenderer({
        startDate,
        endDate
      });
      legendNote.style.display = "none";
      break;
    case "new-total":
      renderer = createNewCasesRenderer({
        startDate,
        endDate
      });
      legendNote.style.display = "none";
      break;
    default:
      break;
  }

  layer.renderer = renderer;
}

interface CreateRendererParams {
  startDate: Date,
  endDate: Date
}

const colorRamps = {
  light: [
    [ "#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c" ],
    [ "#f6eff7", "#bdc9e1", "#67a9cf", "#1c9099", "#016c59" ],
    [ "#f1eef6", "#d7b5d8", "#df65b0", "#dd1c77", "#980043" ],
    [ "#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494" ],
    [ "#54bebe", "#98d1d1", "#dedad2", "#df979e", "#c80064" ],
    [ "#8100e6", "#b360d1", "#f2cf9e", "#6eb830", "#2b9900" ],
    [ "#00998c", "#69d4cb", "#f2f2aa", "#d98346", "#b34a00" ],
    [ "#a6611a", "#dfc27d", "#f5f5f5", "#80cdc1", "#018571" ],
    [ "#454545", "#686868", "#8c8c8c", "#c2c2c2", "#f7f7f7" ].reverse(),
    [ "#f7f7f7", "#cccccc", "#969696", "#636363", "#252525" ],
    [ "#484c59", "#63687a", "#948889", "#e0b9b5", "#ffe9e6" ].reverse(),
    [ "#D0D0E2", "#76ADDB", "#688AB1", "#3F5677", "#302C35" ],  // Mountain Snow
    [ "#FBFD26", "#F9CA41", "#F58873", "#BA5E63", "#5A5262" ].reverse()  // Mentone Beach
  ],
  dark: [
    [ "#0010d9", "#0040ff", "#0080ff", "#00bfff", "#00ffff" ],
    [ "#481295", "#6535a6", "#7d6aa1", "#9e97b8", "#c4bedc" ],
    [ "#00590f", "#008c1a", "#00bf25", "#76df13", "#d0ff00" ],
    [ "#3b3734", "#54504c", "#ab3da9", "#eb44e8", "#ff80ff" ],
    [ "#ff4d6a", "#a63245", "#453437", "#2b819b", "#23ccff" ],
    [ "#23ccff", "#2c8eac", "#42422f", "#9b9b15", "#ffff00" ],
    [ "#ff00ff", "#b21bb2", "#414537", "#76961d", "#beff00" ],
    [ "#ff00cc", "#b21c97", "#453442", "#96961d", "#ffff00" ],
    [ "#ff0099", "#aa1970", "#45343e", "#92781c", "#ffc800" ],
    [ "#e8ff00", "#97a41c", "#413f54", "#655dbb", "#8c80ff" ]
  ],
  dotDensity: {
    light: [
      [ "#e60049", "#b3cde3", "#000000" ],
      [ "#a03500", "#3264c8", "#72b38e" ],
      [ "#e60049", "#0bb4ff", "#50e991", "#9b19f5" ],
      [ "#1e8553", "#c44296", "#d97f00", "#00b6f1" ],
      [ "#0040bf", "#a3cc52", "#b9a087", "#a01fcc" ],
      [ "#dc4b00", "#b3cde3", "#000000" ]
    ],
    dark: [
      [ "#dc4b00", "#3c6ccc", "#d9dc00", "#91d900", "#986ba1" ],
      [ "#1e8553", "#c44296", "#d97f00", "#00b6f1" ],
      [ "#0040bf", "#a3cc52", "#a01fcc", "#5bb698" ],
    ]
  }
}

const dateRangeConfig = {
  colors: colorRamps.light[2],
  stops: [0,250,500,750,1000]
}

function createTotalCasesRenderer(params: CreateRendererParams) : COVIDRenderer {
  const colors = [ "#feedde", "#fdbe85", "#fd8d3c", "#e6550d", "#a63603" ];
  const { startDate, endDate } = params;
  const startDateFieldName = getFieldFromDate(startDate);

  let visualVariables = null;

  if(endDate){
    const endDateFieldName = getFieldFromDate(endDate);

    visualVariables = [
      new SizeVariable({
        valueExpression: expressionDifference(
          createTotalCasesExpression(startDateFieldName),
          createTotalCasesExpression(endDateFieldName)
        ),
        legendOptions: {
          title: `New COVID-19 cases from ${formatDate(startDate)} - ${formatDate(endDate)}`
        },
        stops: [
          { value: 0, size: 0 },
          { value: 1, size: "2px" },
          { value: 100, size: "3px" },
          { value: 1000, size: "5px" },
          { value: 20000, size: "20px" },
          { value: 250000, size: "250px" }
        ]
      })
      // ,
      // new ColorVariable({
      //   valueExpression: expressionPercentChange(
      //     createTotalCasesExpression(startDateFieldName),
      //     createTotalCasesExpression(endDateFieldName)
      //   ),
      //   legendOptions: {
      //     title: `% increase in total cases from ${formatDate(startDate)} - ${formatDate(endDate)}`
      //   },
      //   stops: [
      //     { value: dateRangeConfig.stops[0], color: colors[0], label: "No increase" },
      //     { value: dateRangeConfig.stops[1], color: colors[1] },
      //     { value: dateRangeConfig.stops[2], color: colors[2], label: `${dateRangeConfig.stops[2]}% increase` },
      //     { value: dateRangeConfig.stops[3], color: colors[3] },
      //     { value: dateRangeConfig.stops[4], color: colors[4], label: `${dateRangeConfig.stops[4].toLocaleString()}% increase` }
      //   ]
      // })
    ];

  } else {
    visualVariables = [ new SizeVariable({
      valueExpression: createTotalCasesExpression(startDateFieldName),
      legendOptions: {
        title: `Total COVID-19 cases as of ${formatDate(startDate)}`
      },
      stops: [
        { value: 0, size: 0 },
        { value: 1, size: "2px" },
        { value: 100, size: "3px" },
        { value: 1000, size: "5px" },
        { value: 20000, size: "20px" },
        { value: 250000, size: "250px" }
      ]
    }) ];
  }

  return new SimpleRenderer({
    symbol: createDefaultSymbol(null, new SimpleLineSymbol({
      color: new Color("rgba(227, 0, 106,0.6)"),
      width: 0.5
    })),
    label: "County",
    visualVariables
  });
}

function createDotDensityRenderer(params: CreateRendererParams) : COVIDRenderer {
  const colors = colorRamps.dotDensity.light[0];
  const { startDate, endDate } = params;
  const startDateFieldName = getFieldFromDate(startDate);

  let attributes: DotDensityRenderer["attributes"];

  if(endDate){
    const endDateFieldName = getFieldFromDate(endDate);
    const colors = colorRamps.dotDensity.light[5];

    attributes = [
      new AttributeColorInfo({
        color: colors[0],
        valueExpressionTitle: `Cases from ${formatDate(startDate)} - ${formatDate(endDate)}`,
        valueExpression: expressionDifference(
          createTotalCasesExpression(startDateFieldName),
          createTotalCasesExpression(endDateFieldName)
        ),
      }),
      new AttributeColorInfo({
        color: colors[1],
        valueExpressionTitle: "All cases",
        valueExpression: createTotalCasesExpression(startDateFieldName),
      })
    ];

  } else {
    attributes = [
      new AttributeColorInfo({
        color: colors[0],
        valueExpressionTitle: "Active*",
        valueExpression: createActiveCasesExpression(startDateFieldName),
      }),
      new AttributeColorInfo({
        color: colors[1],
        valueExpressionTitle: "Recovered*",
        valueExpression: createRecoveredCasesExpression(startDateFieldName),
      }),
      new AttributeColorInfo({
        color: colors[2],
        valueExpressionTitle: "Deaths",
        valueExpression: createTotalDeathsExpression(startDateFieldName)
      })
    ];
  }

  return new DotDensityRenderer({
    dotValue: 10,
    referenceScale: null,
    attributes,
    outline: null,
    dotBlendingEnabled: true,
    legendOptions: {
      unit: "cases"
    }
  });
}

function createTotalDeathsRenderer(params: CreateRendererParams) : COVIDRenderer {
  const colors = [ "#f6d7e0", "#e6968e", "#db6a58", "#b44f3b", "#8d331d" ];

  const { startDate, endDate } = params;
  const startDateFieldName = getFieldFromDate(startDate);

  let visualVariables = null;

  if(endDate){
    const endDateFieldName = getFieldFromDate(endDate);

    visualVariables = [
      new SizeVariable({
        valueExpressionTitle: "Total deaths",
        valueExpression: expressionDifference(
          createTotalDeathsExpression(startDateFieldName),
          createTotalDeathsExpression(endDateFieldName)
        ),
        legendOptions: {
          title: `Total COVID-19 deaths from ${formatDate(startDate)} - ${formatDate(endDate)}`
        },
        stops: [
          { value: 0, size: 0 },
          { value: 1, size: "3px" },
          { value: 100, size: "8px" },
          { value: 1000, size: "18px" },
          { value: 5000, size: "60px" },
          { value: 10000, size: "100px" }
        ]
      })
    ];
  } else {
    visualVariables = [
      new SizeVariable({
        valueExpressionTitle: "Total deaths",
        valueExpression: createTotalDeathsExpression(startDateFieldName),
        legendOptions: {
          title: `Total COVID-19 deaths as of ${formatDate(startDate)}`
        },
        stops: [
          { value: 0, size: 0 },
          { value: 1, size: "3px" },
          { value: 100, size: "8px" },
          { value: 1000, size: "18px" },
          { value: 5000, size: "60px" },
          { value: 10000, size: "100px" }
        ]
      })
    ];
  }
  return new SimpleRenderer({
    symbol: createDefaultSymbol(new Color("rgba(15, 15, 15,0.3)"), new SimpleLineSymbol({
      color: new Color("rgba(15, 15, 15,0.8)"),
      width: 0.3
    })),
    label: "County",
    visualVariables
  });
}

function createNewCasesRenderer(params: CreateRendererParams) : COVIDRenderer{
  const colors = lang.clone(colorRamps.light[6]);
  const { startDate, endDate } = params;
  const startDateFieldName = getFieldFromDate(startDate);

  let visualVariables = null;

  if(endDate){
    const endDateFieldName = getFieldFromDate(endDate);

    visualVariables = [
      new SizeVariable({
        valueExpressionTitle: `7-day rolling average of new COVID-19 cases as of ${formatDate(startDate)}`,
        valueExpression: createNewCasesAverageExpression(startDateFieldName),
        stops: [
          { value: 0, size: 0 },
          { value: 1, size: "2px" },
          { value: 100, size: "10px" },
          { value: 1000, size: "32px" },
          { value: 10000, size: "100px" }
        ]
      }), new ColorVariable({
        valueExpressionTitle: `Change in 7-day rolling average of new COVID-19 cases from ${formatDate(startDate)} - ${formatDate(endDate)}`,
        valueExpression: expressionDifference(
          createNewCasesAverageExpression(startDateFieldName, true),
          createNewCasesAverageExpression(endDateFieldName, true),
          true
        ),
        stops: [
          { value: -1, color: colors[0], label: "Decrease"},
          { value: 0, color: colors[2] },
          { value: 1, color: colors[4], label: "Increase" },
        ]
      })
    ];
  } else {
    visualVariables = [ new SizeVariable({
      valueExpressionTitle: `7-day rolling average of new COVID-19 cases as of ${formatDate(startDate)}`,
      valueExpression: createNewCasesAverageExpression(startDateFieldName),
      stops: [
        { value: 0, size: 0 },
        { value: 1, size: "2px" },
        { value: 100, size: "10px" },
        { value: 1000, size: "32px" },
        { value: 10000, size: "100px" }
      ]
    }) ];
  }
  return new SimpleRenderer({
    symbol: createDefaultSymbol(new Color("rgba(212, 74, 0,0.25)"), new SimpleLineSymbol({
      color: new Color("rgba(255, 255, 255,0.3)"),
      width: 0.5
    })),
    label: "County",
    visualVariables
  });
}

function createActiveCasesRenderer(params: CreateRendererParams) : COVIDRenderer {
  const colors = colorRamps.light[0];

  const { startDate, endDate } = params;
  const startDateFieldName = getFieldFromDate(startDate);

  let visualVariables = null;
  let authoringInfo: __esri.AuthoringInfo = null;

  if( endDate ){
    const colors = colorRamps.light[6];
    const endDateFieldName = getFieldFromDate(endDate);
    authoringInfo = {
      type: "univariate-color-size",
      statistics: {
        min: -10000,
        max: 10000
      },
      univariateTheme: "above-and-below"
    } as __esri.AuthoringInfo;
    visualVariables = [
      new SizeVariable({
        valueExpressionTitle: `Change in estimated active* COVID-19 cases from ${formatDate(startDate)} - ${formatDate(endDate)}`,
        valueExpression: expressionDifference(
          createActiveCasesExpression(startDateFieldName, true),
          createActiveCasesExpression(endDateFieldName, true),
          true
        ),
        stops: [
          { value: -10000, size: "50px" },
          { value: -1000, size: "10px" },
          { value: 0, size: "4px" },
          { value: 1000, size: "10px" },
          { value: 10000, size: "50px" }
        ]
      }),
      new ColorVariable({
        valueExpression: expressionPercentChange(
          createActiveCasesExpression(startDateFieldName, true),
          createActiveCasesExpression(endDateFieldName, true),
          true
        ),
        legendOptions: {
          title: `Change in active* cases from ${formatDate(startDate)} - ${formatDate(endDate)}`
        },
        stops: [
          { value: -100, color: colors[0], label: "Decrease" },
          { value: -50, color: colors[1] },
          { value: 0, color: colors[2], label: `No change` },
          { value: 50, color: colors[3] },
          { value: 100, color: colors[4], label: `Increase` }
        ]
      })
    ];
  } else {
    visualVariables = [ new SizeVariable({
      valueExpressionTitle: `Estimated active* COVID-19 cases on ${formatDate(startDate)}`,
      valueExpression: createActiveCasesExpression(startDateFieldName),
      stops: [
        { value: 0, size: 0 },
        { value: 1, size: "2px" },
        { value: 100, size: "4px" },
        { value: 1000, size: "8px" },
        { value: 10000, size: "32px" },
        { value: 100000, size: "120px" }
      ]
    }) ];
  }

  return new SimpleRenderer({
    authoringInfo,
    symbol: createDefaultSymbol(new Color("rgba(230, 0, 73, 0.2)"), new SimpleLineSymbol({
      color: endDate ? new Color("rgba(255, 255, 255, 0.6)") : new Color("rgba(230, 0, 73, 0.8)"),
      width: 0.3
    })),
    label: "County",
    visualVariables
  });
}

function createDoublingTimeRenderer(params: CreateRendererParams) : COVIDRenderer {
  const colors = colorRamps.light[0];
  const { startDate, endDate } = params;
  const startDateFieldName = getFieldFromDate(startDate);

  let visualVariables = null;

  if(endDate){
    const colors = colorRamps.light[4];
    const endDateFieldName = getFieldFromDate(endDate);

    visualVariables = [
      new SizeVariable({
        valueExpression: expressionDifference(
          createActiveCasesExpression(startDateFieldName, true),
          createActiveCasesExpression(endDateFieldName, true),
          true
        ),
        legendOptions: {
          title: `Estimated active* COVID-19 cases from ${formatDate(startDate)} - ${formatDate(endDate)}`
        },
        stops: [
          { value: 0, size: 0 },
          { value: 1, size: "2px" },
          { value: 100, size: "4px" },
          { value: 1000, size: "8px" },
          { value: 10000, size: "32px" },
          { value: 100000, size: "120px" }
        ]
      }),
      new ColorVariable({
        valueExpressionTitle: `Doubling time change from ${formatDate(startDate)} - ${formatDate(endDate)}`,
        valueExpression: expressionDifference(
          createDoublingTimeExpression(startDateFieldName, true),
          createDoublingTimeExpression(endDateFieldName, true),
          true
        ),
        stops: [
          { value: -60, color: colors[4], label: ">60 days faster (bad)" },
          { value: -30, color: colors[3] },
          { value: 0, color: colors[2], label: "No change" },
          { value: 30, color: colors[1] },
          { value: 60, color: colors[0], label: ">60 days slower (good)" }
        ]
      })
    ]
  } else {
    visualVariables = [
      new SizeVariable({
        valueExpression: createActiveCasesExpression(startDateFieldName),
        legendOptions: {
          title: `Estimated active* COVID-19 cases as of ${formatDate(startDate)}`
        },
        stops: [
          { value: 0, size: 0 },
          { value: 1, size: "2px" },
          { value: 100, size: "4px" },
          { value: 1000, size: "8px" },
          { value: 10000, size: "32px" },
          { value: 100000, size: "120px" }
        ]
      }),
      new ColorVariable({
        valueExpressionTitle: "Doubling Time",
        valueExpression: createDoublingTimeExpression(startDateFieldName),
        stops: [
          { value: 7, color: colors[4], label: "<7 days" },
          { value: 14, color: colors[3] },
          { value: 30, color: colors[2], label: "30 days" },
          { value: 48, color: colors[1] },
          { value: 60, color: colors[0], label: ">60 days" }
        ]
      }),
      new OpacityVariable({
        legendOptions: {
          showLegend: false
        },
        valueExpression: createDoublingTimeExpression(startDateFieldName),
        stops: [
          { value: 7, opacity: 1 },
          { value: 14, opacity: 0.6 },
          { value: 28, opacity: 0.4 }
        ]
      })
    ]
  }

  return new SimpleRenderer({
    symbol: createDefaultSymbol(new Color("#f7f7f7")),
    label: "County",
    visualVariables
  });
}

function createDeathRateRenderer(params: CreateRendererParams) : COVIDRenderer {
  const colors = colorRamps.light[9];
  const { startDate, endDate } = params;
  const startDateFieldName = getFieldFromDate(startDate);

  let visualVariables = null;

  if(endDate){
    const endDateFieldName = getFieldFromDate(endDate);
    const colors = colorRamps.light[6];

    visualVariables = [
      new SizeVariable({
        valueExpressionTitle: "Total deaths",
        valueExpression: expressionDifference(
          createTotalDeathsExpression(startDateFieldName),
          createTotalDeathsExpression(endDateFieldName)
        ),
        legendOptions: {
          title: `New COVID-19 deaths from ${formatDate(startDate)} - ${formatDate(endDate)}`
        },
        stops: [
          { value: 0, size: 0 },
          { value: 1, size: "3px" },
          { value: 100, size: "8px" },
          { value: 1000, size: "18px" },
          { value: 5000, size: "60px" },
          { value: 10000, size: "100px" }
        ]
      }),
      new ColorVariable({
        valueExpression: expressionDifference(
          createDeathRateExpression(startDateFieldName),
          createDeathRateExpression(endDateFieldName),
          true
        ),
        valueExpressionTitle: `Change in death rate by % points`,
        stops: [
          { value: -5, color: colors[0] },
          { value: -2, color: colors[1] },
          { value: 0, color: colors[2] },
          { value: 2, color: colors[3] },
          { value: 5, color: colors[4] }
        ]
      })
    ];
  } else {
    visualVariables = [
      new SizeVariable({
        valueExpressionTitle: "Total deaths",
        valueExpression: createTotalDeathsExpression(startDateFieldName),
        legendOptions: {
          title: `Total COVID-19 deaths as of ${formatDate(startDate)}`
        },
        stops: [
          { value: 0, size: 0 },
          { value: 1, size: "3px" },
          { value: 100, size: "8px" },
          { value: 1000, size: "18px" },
          { value: 5000, size: "60px" },
          { value: 10000, size: "100px" }
        ]
      }),
      new ColorVariable({
        valueExpressionTitle: "Deaths as % of cases",
        valueExpression: createDeathRateExpression(startDateFieldName),
        stops: [
          { value: 1, color: colors[0] },
          { value: 5, color: colors[1] },
          { value: 7, color: colors[2] },
          { value: 10, color: colors[3] },
          { value: 20, color: colors[4] }
        ]
      })
    ];
  }

  return new SimpleRenderer({
    symbol: createDefaultSymbol(new Color("#f7f7f7")),
    label: "County",
    visualVariables
  });
}

function createCaseRateRenderer(params: CreateRendererParams) : COVIDRenderer {
  const colors = colorRamps.light[0];

  const { startDate, endDate } = params;
  const startDateFieldName = getFieldFromDate(startDate);

  let visualVariables = null;

  if(endDate){
    const colors = colorRamps.light[2];
    const endDateFieldName = getFieldFromDate(endDate);

    visualVariables = [
      new ColorVariable({
        valueExpression: expressionDifference(
          createCaseRateExpression(startDateFieldName),
          createCaseRateExpression(endDateFieldName)
        ),
        valueExpressionTitle: `Change in COVID-19 cases per 100k people`,
        stops: [
          { value: 0, color: colors[0] },
          { value: 250, color: colors[1] },
          { value: 500, color: colors[2] },
          { value: 1000, color: colors[3] },
          { value: 2500, color: colors[4] }
        ]
      })
    ];
  } else {
    visualVariables = [
      new ColorVariable({
        valueExpression: createCaseRateExpression(startDateFieldName),
        valueExpressionTitle: `% of population infected with COVID-19`,
        stops: [
          { value: 0, color: colors[0], label: "0%" },
          { value: 2500, color: colors[1] },
          { value: 5000, color: colors[2], label: "5%" },
          { value: 7500, color: colors[3] },
          { value: 10000, color: colors[4], label: "10%" }
        ]
      })
    ];
  }

  return new SimpleRenderer({
    symbol: new SimpleFillSymbol({
      outline: new SimpleLineSymbol({
        color: "rgba(128,128,128,0.4)",
        width: 0
      })
    }),
    label: "County",
    visualVariables
  });
}

function createDeaths100kRenderer(params: CreateRendererParams) : COVIDRenderer {
  const colors = colorRamps.light[8];

  const { startDate, endDate } = params;
  const startDateFieldName = getFieldFromDate(startDate);

  let visualVariables = null;

  if(endDate){
    const endDateFieldName = getFieldFromDate(endDate);

    visualVariables = [
      new ColorVariable({
        valueExpression: expressionDifference(
          createDeathRate100kExpression(startDateFieldName),
          createDeathRate100kExpression(endDateFieldName)
        ),
        valueExpressionTitle: `Change in COVID-19 deaths per 100k people`,
        stops: [
          { value: 0, color: colors[0] },
          { value: 25, color: colors[1] },
          { value: 50, color: colors[2] },
          { value: 75, color: colors[3] },
          { value: 100, color: colors[4] }
        ]
      })
    ];
  } else {
    visualVariables = [
      new ColorVariable({
        valueExpression: createDeathRate100kExpression(startDateFieldName),
        valueExpressionTitle: `Total COVID-19 deaths per 100k people`,
        stops: [
          { value: 0, color: colors[0] },
          { value: 50, color: colors[1] },
          { value: 100, color: colors[2] },
          { value: 150, color: colors[3] },
          { value: 300, color: colors[4] }
        ]
      })
    ];
  }

  return new SimpleRenderer({
    symbol: new SimpleFillSymbol({
      outline: new SimpleLineSymbol({
        color: "rgba(128,128,128,0.4)",
        width: 0
      })
    }),
    label: "County",
    visualVariables
  });
}

function createActiveRateRenderer(params: CreateRendererParams) : COVIDRenderer {
  const colors = colorRamps.light[0];
  const { startDate, endDate } = params;
  const startDateFieldName = getFieldFromDate(startDate);

  let visualVariables = null;

  if(endDate){
    const colors = colorRamps.light[6];
    const endDateFieldName = getFieldFromDate(endDate);

    visualVariables = [
      new ColorVariable({
        valueExpression: expressionDifference(
          createActiveCasesPer100kExpression(startDateFieldName, true),
          createActiveCasesPer100kExpression(endDateFieldName, true),
          true
        ),
        valueExpressionTitle: `Change in estimated active* COVID-19 cases per 100k people`,
        stops: [
          { value: -1000, color: colors[0] },
          { value: -500, color: colors[1] },
          { value: 0, color: colors[2] },
          { value: 500, color: colors[3] },
          { value: 1000, color: colors[4] }
        ]
      })
    ];
  } else {
    visualVariables = [
      new ColorVariable({
        valueExpression: createActiveCasesPer100kExpression(startDateFieldName),
        valueExpressionTitle: `Estimated active* COVID-19 cases per 100k people`,
        stops: [
          { value: 50, color: colors[0] },
          { value: 200, color: colors[1] },
          { value: 500, color: colors[2] },
          { value: 1000, color: colors[3] },
          { value: 2000, color: colors[4] }
        ]
      })
    ];
  }

  return new SimpleRenderer({
    symbol: new SimpleFillSymbol({
      outline: new SimpleLineSymbol({
        color: "rgba(128,128,128,0.4)",
        width: 0
      }),
    }),
    label: "County",
    visualVariables
  });
}

function createDefaultSymbol(color?: Color, outline?: SimpleLineSymbol) : SimpleMarkerSymbol{
  return new SimpleMarkerSymbol({
    color: color || null,
    size: 4,
    outline: outline || {
      color: "rgba(200,200,200,0.4)",
      width: 0.5
    }
  });
}