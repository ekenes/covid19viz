import FeatureLayer = require("esri/layers/FeatureLayer");
import { SimpleRenderer } from "esri/renderers";
import { SimpleMarkerSymbol } from "esri/symbols";

// Data from Johns Hopkins University
// "https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series";

const polygonFillPortalItemId = "7028ee5e506342b4a0f0a8b06f32422d";
const polygonFillLayerId = 2;  // polygons

export const separator = "_";
export const prefix = "DAYSTRING_";

export const infectionsPopulationLayer = new FeatureLayer({
  title: null,
  portalItem: {
    id: polygonFillPortalItemId
  },
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
