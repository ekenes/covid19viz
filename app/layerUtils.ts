import FeatureLayer = require("esri/layers/FeatureLayer");
import LabelClass = require("esri/layers/support/LabelClass");
import Color = require("esri/Color");
import { SimpleRenderer } from "esri/renderers";
import { SimpleMarkerSymbol, TextSymbol } from "esri/symbols";

// Data from Johns Hopkins University
// "https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series";

export const polygonFillPortalItemId = "3d170bd624804d59b3009cafa5294a66";
export const polygonFillLayerId = 0;  // 2020

export const infectionsPopulationLayer2020 = new FeatureLayer({
  title: null,
  portalItem: {
    id: polygonFillPortalItemId
  },
  copyright: `App and maps by <a href="https://github.com/ekenes">Kristian Ekenes</a>`,
  layerId: polygonFillLayerId,
  outFields: ["*"],
  opacity: 1,
  renderer: new SimpleRenderer({
    symbol: new SimpleMarkerSymbol({
      size: 1,
      color: null,
      outline: null
    })
  })
});

export const infectionsPopulationLayer2021 = new FeatureLayer({
  title: null,
  portalItem: {
    id: polygonFillPortalItemId
  },
  opacity: 0.01,
  copyright: `App and maps by <a href="https://github.com/ekenes">Kristian Ekenes</a>`,
  layerId: 1,
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

export function setActiveLayer(d: Date){
  const activeLayer = d.getFullYear() < 2021 ? infectionsPopulationLayer2020 : infectionsPopulationLayer2021;
  activeLayer.opacity = 1;
  activeLayer.popupEnabled = true;
  activeLayer.legendEnabled = true;
  return activeLayer;
}

export function setInactiveLayer(d: Date){
  const inactiveLayer = d.getFullYear() < 2021 ? infectionsPopulationLayer2021 : infectionsPopulationLayer2020;
  inactiveLayer.opacity = 0.01;
  inactiveLayer.popupEnabled = false;
  inactiveLayer.legendEnabled = false;
  return inactiveLayer;
}