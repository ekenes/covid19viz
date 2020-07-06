import SimpleRenderer = require("esri/renderers/SimpleRenderer");
import ColorVariable = require("esri/renderers/visualVariables/ColorVariable");
import SizeVariable = require("esri/renderers/visualVariables/SizeVariable");
import OpacityVariable = require("esri/renderers/visualVariables/OpacityVariable");
import Color = require("esri/Color");

import CSVLayer = require("esri/layers/CSVLayer");
import FeatureLayer = require("esri/layers/FeatureLayer");
import { initialTimeExtent, getFieldFromDate, formatDate } from "./timeUtils";
import { createTotalInfectionsExpression, createNewInfectionsExpression, createDoublingTimeExpression, createActiveCasesPer100kExpression, createInfectionRateExpression, createActiveCasesExpression, createNewInfectionPercentTotalExpression, createDeathRateExpression, createTotalDeathsExpression } from "./expressionUtils";
import { SimpleLineSymbol, SimpleMarkerSymbol, SimpleFillSymbol } from "esri/symbols";
import { updateRangeRenderer } from "./rendererRangeUtils";

export class RendererVars {
  public static activeRendererType: UpdateRendererParams["rendererType"] = "total-infections";
}

export interface UpdateRendererParams {
  layer: CSVLayer | FeatureLayer,
  rendererType: "total-infections" | "doubling-time" | "total-deaths" | "total-active" |
    "active-rate" | "infection-rate-per-100k" | "death-rate" | "total-color" |
    "new-total" | "total-color-new-total-size"
  currentDate: Date,
  endDate?: Date
}

export type COVIDRenderer = SimpleRenderer;

export function updateRenderer(params: UpdateRendererParams){
  const { layer, rendererType, currentDate, endDate } = params;

  let renderer: COVIDRenderer;

  renderer = updateRangeRenderer(params);
  layer.renderer = renderer;
  return;

  switch (rendererType) {
    case "total-infections":
      renderer = createInfectionAccumulatedRenderer({
        currentDate
      });
      break;
    case "doubling-time":
      renderer = createDoublingTimeRenderer({
        currentDate
      });
      break;
    case "total-deaths":
      renderer = createDeathsAccumulatedRenderer({
        currentDate
      });
      break;
    case "total-active":
      renderer = createActiveCasesTotalSizeRenderer({
        currentDate
      });
      break;
    case "active-rate":
      renderer = createActiveRateFillRenderer({
        currentDate
      });
      break;
    case "infection-rate-per-100k":
      renderer = createInfectionRateFillRenderer({
        currentDate
      });
      break;
    case "death-rate":
      renderer = createDeathRateRenderer({
        currentDate
      });
      break;
    case "total-color":
      renderer = createColorAccumulatedRenderer({
        currentDate
      });
      break;
    case "new-total":
      renderer = createSizeNewInfectionsRenderer({
        currentDate
      });
      break;
    case "total-color-new-total-size":
      renderer = createTotalsRenderer({
        currentDate
      });
      break;
    default:
      break;
  }

  layer.renderer = renderer;
}

interface CreateRendererParams {
  currentDate: Date
}

function createInfectionAccumulatedRenderer(params: CreateRendererParams) : COVIDRenderer {
  const { currentDate } = params;
  const currentDateFieldName = getFieldFromDate(currentDate);
  return new SimpleRenderer({
    symbol: createDefaultSymbol(null, new SimpleLineSymbol({
      color: new Color("rgba(227, 0, 106,0.6)"),
      width: 0.5
    })),
    label: "County",
    visualVariables: [
      new SizeVariable({
        valueExpression: createTotalInfectionsExpression(currentDateFieldName),
        legendOptions: {
          title: `Total COVID-19 cases as of ${formatDate(currentDate)}`
        },
        stops: [
          { value: 0, size: 0 },
          { value: 1, size: "2px" },
          { value: 100, size: "4px" },
          { value: 1000, size: "10px" },
          { value: 10000, size: "50px" },
          { value: 200000, size: "200px" }
        ]
      })
    ]
  });
}

function createDeathsAccumulatedRenderer(params: CreateRendererParams) : COVIDRenderer {
  const { currentDate } = params;
  const currentDateFieldName = getFieldFromDate(currentDate);
  return new SimpleRenderer({
    symbol: createDefaultSymbol(null, new SimpleLineSymbol({
      color: new Color("rgba(227, 0, 106,0.6)"),
      width: 0.5
    })),
    label: "County",
    visualVariables: [
      new SizeVariable({
        valueExpressionTitle: "Total deaths",
        valueExpression: createTotalDeathsExpression(currentDateFieldName),
        legendOptions: {
          title: `Total COVID-19 deaths as of ${formatDate(currentDate)}`
        },
        stops: [
          { value: 0, size: 0 },
          { value: 1, size: "3px" },
          { value: 100, size: "8px" },
          { value: 1000, size: "18px" },
          { value: 5000, size: "50px" },
          { value: 30000, size: "100px" }
        ]
      })
    ]
  });
}

function createColorAccumulatedRenderer(params: CreateRendererParams) : COVIDRenderer {
  const { currentDate } = params;
  const colors = [ "#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c" ];
  const currentDateFieldName = getFieldFromDate(currentDate);
  return new SimpleRenderer({
    symbol: createDefaultSymbol(new Color("gray"), new SimpleLineSymbol({
      color: "rgba(128,128,128,0.8)",
      width: 0
    })),
    visualVariables: [
      new ColorVariable({
        valueExpression: createTotalInfectionsExpression(currentDateFieldName),
        legendOptions: {
          title: `Total COVID-19 cases as of ${formatDate(currentDate)}`
        },
        stops: [
          { value: 10, color: colors[0] },
          { value: 100, color: colors[1] },
          { value: 1000, color: colors[2] },
          { value: 10000, color: colors[3] },
          { value: 200000, color: colors[4] }
        ]
      })
    ]
  });
}

function createSizeNewInfectionsRenderer(params: CreateRendererParams) : COVIDRenderer{
  const { currentDate } = params;
  const currentDateFieldName = getFieldFromDate(currentDate);
  return new SimpleRenderer({
    symbol: createDefaultSymbol(null, new SimpleLineSymbol({
      color: new Color("rgba(222, 18, 222, 0.5)"),
      width: 0.5
    })),
    label: "County",
    visualVariables: [new SizeVariable({
      valueExpressionTitle: `New COVID-19 cases reported on ${currentDateFieldName}`,
      valueExpression: createNewInfectionsExpression(currentDateFieldName),
      stops: [
        { value: 0, size: 0 },
        { value: 1, size: "2px" },
        // { value: 100, size: "4px" },
        { value: 100, size: "10px" },
        { value: 1000, size: "50px" },
        { value: 5000, size: "200px" }
      ]
    })]
  });
}

function createActiveCasesTotalSizeRenderer(params: CreateRendererParams) : COVIDRenderer{
  const { currentDate } = params;
  const currentDateFieldName = getFieldFromDate(currentDate);
  return new SimpleRenderer({
    symbol: createDefaultSymbol(null, new SimpleLineSymbol({
      color: new Color("rgba(222, 18, 222, 1)"),
      width: 0.5
    })),
    label: "County",
    visualVariables: [new SizeVariable({
      valueExpressionTitle: `Active COVID-19 cases on ${formatDate(currentDate)}`,
      valueExpression: createActiveCasesExpression(currentDateFieldName),
      stops: [
        { value: 0, size: 0 },
        { value: 1, size: "2px" },
        { value: 100, size: "4px" },
        { value: 1000, size: "10px" },
        { value: 10000, size: "50px" },
        { value: 100000, size: "200px" }
      ]
    })]
  });
}

function createDoublingTimeRenderer(params: CreateRendererParams) : COVIDRenderer {
  const { currentDate } = params;
  const colors = [ "#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c" ];
  const currentDateFieldName = getFieldFromDate(currentDate);
  const valueExpression = createDoublingTimeExpression(currentDateFieldName);

  return new SimpleRenderer({
    symbol: createDefaultSymbol(new Color("#f7f7f7")),
    label: "County",
    visualVariables: [
      new SizeVariable({
        valueExpression: createTotalInfectionsExpression(currentDateFieldName),
        legendOptions: {
          title: `Total COVID-19 cases as of ${formatDate(currentDate)}`
        },
        stops: [
          { value: 0, size: 0 },
          { value: 1, size: "2px" },
          { value: 100, size: "4px" },
          { value: 1000, size: "10px" },
          { value: 10000, size: "50px" },
          { value: 200000, size: "200px" }
        ]
      }),
      new ColorVariable({
        valueExpressionTitle: "Doubling Time",
        valueExpression,
        stops: [
          { value: 7, color: colors[4], label: "<7 days" },
          { value: 10, color: colors[3] },
          { value: 14, color: colors[2], label: "14 days" },
          { value: 21, color: colors[1] },
          { value: 28, color: colors[0], label: ">28 days" }
        ]
      }),
      new OpacityVariable({
        legendOptions: {
          showLegend: false
        },
        valueExpression,
        stops: [
          { value: 7, opacity: 1 },
          { value: 14, opacity: 0.6 },
          { value: 28, opacity: 0.4 }
        ]
      })
    ]
  });
}

function createDeathRateRenderer(params: CreateRendererParams) : COVIDRenderer {
  const { currentDate } = params;
  const colors = [ "#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c" ];
  const currentDateFieldName = getFieldFromDate(currentDate);

  return new SimpleRenderer({
    symbol: createDefaultSymbol(new Color("#f7f7f7")),
    label: "County",
    visualVariables: [
      new SizeVariable({
        valueExpressionTitle: "Total deaths",
        valueExpression: createTotalDeathsExpression(currentDateFieldName),
        legendOptions: {
          title: `Total COVID-19 deaths as of ${formatDate(currentDate)}`
        },
        stops: [
          { value: 0, size: 0 },
          { value: 1, size: "3px" },
          { value: 100, size: "8px" },
          { value: 1000, size: "18px" },
          { value: 5000, size: "50px" },
          { value: 30000, size: "100px" }
        ]
      }),
      new ColorVariable({
        valueExpressionTitle: "Death rate",
        valueExpression: createDeathRateExpression(currentDateFieldName),
        stops: [
          { value: 1, color: colors[0] },
          { value: 5, color: colors[1] },
          { value: 7, color: colors[2] },
          { value: 10, color: colors[3] },
          { value: 20, color: colors[4] }
        ]
      })
    ]
  });
}

function createTotalsRenderer(params: CreateRendererParams) : COVIDRenderer {
  const { currentDate } = params;
  const colors = [ "#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c" ];
  const currentDateFieldName = getFieldFromDate(currentDate);

  return new SimpleRenderer({
    symbol: createDefaultSymbol(new Color("#f7f7f7"), new SimpleLineSymbol({
      color: "rgba(102, 2, 2,0.2)",
      width: 0.4
    })),
    label: "County",
    visualVariables: [
      new SizeVariable({
        valueExpression: createNewInfectionsExpression(currentDateFieldName),
        valueExpressionTitle: `Reported cases on ${currentDateFieldName}`,
        stops: [
          { value: 0, size: 0 },
          { value: 0, size: "4px" },
          { value: 100, size: "10px" },
          { value: 1000, size: "50px" },
          { value: 5000, size: "200px" }
        ]
      }),
      new ColorVariable({
        field: currentDateFieldName,
        legendOptions: {
          title: `Total cases since ${getFieldFromDate(initialTimeExtent.start)}`
        },
        stops: [
          { value: 10, color: colors[0] },
          { value: 100, color: colors[1] },
          { value: 1000, color: colors[2] },
          { value: 10000, color: colors[3] },
          { value: 200000, color: colors[4] }
        ]
      })
    ]
  });
}

function createInfectionRateFillRenderer(params: CreateRendererParams) : COVIDRenderer {
  const { currentDate } = params;
  const colors = [ "#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c" ];
  const currentDateFieldName = getFieldFromDate(currentDate);
  return new SimpleRenderer({
    symbol: new SimpleFillSymbol({
      outline: new SimpleLineSymbol({
        color: "rgba(128,128,128,0.4)",
        width: 0
      })
    }),
    label: "County",
    visualVariables: [
      new ColorVariable({
        valueExpression: createInfectionRateExpression(currentDateFieldName),
        valueExpressionTitle: `Total COVID-19 cases per 100k people`,
        stops: [
          { value: 50, color: colors[0] },
          { value: 200, color: colors[1] },
          { value: 500, color: colors[2] },
          { value: 1000, color: colors[3] },
          { value: 1500, color: colors[4] }
        ]
      })
    ]
  });
}

function createActiveRateFillRenderer(params: CreateRendererParams) : COVIDRenderer {
  const { currentDate } = params;
  const colors = [ "#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c" ];
  const currentDateFieldName = getFieldFromDate(currentDate);
  return new SimpleRenderer({
    symbol: new SimpleFillSymbol({
      outline: new SimpleLineSymbol({
        color: "rgba(128,128,128,0.4)",
        width: 0
      }),
    }),
    label: "County",
    visualVariables: [
      new ColorVariable({
        valueExpression: createActiveCasesPer100kExpression(currentDateFieldName),
        valueExpressionTitle: `Active COVID-19 cases per 100k people`,
        stops: [
          { value: 50, color: colors[0] },
          { value: 200, color: colors[1] },
          { value: 500, color: colors[2] },
          { value: 1000, color: colors[3] },
          { value: 1500, color: colors[4] }
        ]
      })
    ]
  });
}

function createDefaultSymbol(color: Color, outline?: SimpleLineSymbol) : SimpleMarkerSymbol{
  return new SimpleMarkerSymbol({
    color: color || null,
    size: 4,
    outline: outline || {
      color: "rgba(200,200,200,0.4)",
      width: 0.5
    }
  });
}