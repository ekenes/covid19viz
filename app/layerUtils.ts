import FeatureLayer = require("esri/layers/FeatureLayer");
import LabelClass = require("esri/layers/support/LabelClass");
import Color = require("esri/Color");
import { SimpleRenderer } from "esri/renderers";
import { SimpleMarkerSymbol, TextSymbol } from "esri/symbols";

// Data from Johns Hopkins University
// "https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series";

export const polygonFillPortalItemId = "45389b90ed234ab4be65820e081254c4";
export const polygonFillLayerId = 2;  // polygons

export const separator = "_";
export const prefix = "DAYSTRING_";

export const infectionsPopulationLayer = new FeatureLayer({
  title: null,
  portalItem: {
    id: polygonFillPortalItemId
  },
  copyright: `App and maps by <a href="https://github.com/ekenes">Kristian Ekenes</a>`,
  layerId: polygonFillLayerId,
  outFields: ["*"],
  renderer: new SimpleRenderer({
    symbol: new SimpleMarkerSymbol({
      size: 1,
      color: null,
      outline: null
    })
  })
});

export const fillColor = "#ece8e8";

export const citiesContextLayer = new FeatureLayer({
  opacity: 0.5,
  portalItem: {
    id: "85d0ca4ea1ca4b9abf0c51b9bd34de2e"
  },
  title: "Major cities",
  definitionExpression: "POPULATION > 500000",
  legendEnabled: false,
  popupEnabled: false,
  renderer: new SimpleRenderer({
    symbol: new SimpleMarkerSymbol({
      size: 1,
      color: null,
      outline: null
    })
  }),
  labelingInfo: [
    new LabelClass({
      labelExpressionInfo: {
        expression: `$feature.name`
      },
      symbol: new TextSymbol({
        color: new Color([75, 75, 75]),
        haloColor: new Color([236, 232, 232, 1]),
        haloSize: 1,
        font: {
          size: "10pt",
          family: "Noto Sans",
          style: "normal",
          weight: "normal"
        }
      }),
      labelPlacement: "above-right"
    })
  ]
});

