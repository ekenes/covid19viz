import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");

import FeatureLayer = require("esri/layers/FeatureLayer");
import TimeSlider = require("esri/widgets/TimeSlider");
import TimeInterval = require("esri/TimeInterval");
import watchUtils = require("esri/core/watchUtils");

import Color = require("esri/Color");

import Legend = require("esri/widgets/Legend");
import Zoom = require("esri/widgets/Zoom");
import Search = require("esri/widgets/Search");
import LayerSearchSource = require("esri/widgets/Search/LayerSearchSource");

import { endDate, initialTimeExtent } from "./timeUtils";
import { updateRenderer, UpdateRendererParams } from "./rendererUtils";
import { updatePopupTemplate } from "./popupTemplateUtils";
import { infectionsPopulationLayer } from "./layerUtils";
import { SimpleRenderer } from "esri/renderers";
import { SimpleFillSymbol, SimpleLineSymbol, TextSymbol } from "esri/symbols";

(async () => {

  const rendererSelect = document.getElementById("renderer-select") as HTMLSelectElement;

  const map = new WebMap({
    basemap: {
      baseLayers: [
        new FeatureLayer({
          portalItem: {
            id: "2b93b06dc0dc4e809d3c8db5cb96ba69"
          },
          spatialReference: {
            wkid: 102008
          },
          popupEnabled: false,
          renderer: new SimpleRenderer({
            symbol: new SimpleFillSymbol({
              color: new Color("#f3f3f3"),
              outline: new SimpleLineSymbol({
                color: new Color("#cfd3d4"),
                width: 2.5
              })
            })
          })
        }),
        new FeatureLayer({
          portalItem: {
            id: "99fd67933e754a1181cc755146be21ca"
          },
          spatialReference: {
            wkid: 102008
          },
          minScale: 25000000,
          maxScale: 0,
          popupEnabled: false,
          renderer: new SimpleRenderer({
            symbol: new SimpleFillSymbol({
              color: new Color("#f3f3f3"),
              style: "none",
              outline: new SimpleLineSymbol({
                color: new Color("#cfd3d4"),
                width: 1.2
              })
            })
          })
        }),
        new FeatureLayer({
          portalItem: {
            id: "7566e0221e5646f99ea249a197116605"
          },
          labelingInfo: [{
            labelExpressionInfo: {
              expression: `$feature.NAME`
            },
            symbol: new TextSymbol({
              font: {
                family: "Noto Sans",
                size: 12,
                weight: "lighter"
              },
              color: new Color("#cfd3d4")
            }),
            minScale: 1500000
          }],
          spatialReference: {
            wkid: 102008
          },
          minScale: 3000000,
          maxScale: 0,
          popupEnabled: false,
          renderer: new SimpleRenderer({
            symbol: new SimpleFillSymbol({
              color: new Color("#f3f3f3"),
              style: "none",
              outline: new SimpleLineSymbol({
                color: new Color("#cfd3d4"),
                width: 0.25
              })
            })
          })
        })
      ]
    }
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: {
      "spatialReference": {
        "wkid": 102008
      },
      "x": 84858.41480916333,
      "y": -83568.3783140908
    },
    scale: 18000000,
    constraints: {
      minScale: 25000000
    },
    popup: {
      dockEnabled: true,
      dockOptions: {
        breakpoint: false,
        position: "top-left"
      }
    },
    ui: {
      components: [ "attribution" ]
    }
  });

  const search = new Search({
    view,
    includeDefaultSources: false,
    sources: [
      new LayerSearchSource({
        layer: infectionsPopulationLayer,
        searchFields: [ "Admin2", "Province_State" ],
        displayField: "Admin2",
        suggestionTemplate: "{Admin2}, {Province_State}",
        searchTemplate: "{Admin2}, {Province_State}",
        placeholder: "Enter county name",
        minSuggestCharacters: 2,
        name: "Counties",
        exactMatch: false,
        outFields: ["*"]
      })
    ]
  });

  new Legend({
    view,
    container: "legend"
  });

  view.ui.add("ui-controls", "top-right");
  view.ui.add(new Zoom({ view }), "bottom-right");
  view.ui.add(search, "top-left");

  const slider = new TimeSlider({
    container: "timeSlider",
    playRate: 50,
    fullTimeExtent: {
      start: new Date(2020, 0, 22),
      end: endDate
    },
    mode: "instant",
    values: [ initialTimeExtent.start ],
    stops: {
      interval: new TimeInterval({
        value: 1,
        unit: "days"
      })
    },
    view
  });

  view.ui.add("timeOptions", "bottom-center");

  async function initializeLayer(){
    map.add(infectionsPopulationLayer);
    const activeLayerView = await view.whenLayerView(infectionsPopulationLayer);

    watchUtils.whenFalseOnce(activeLayerView, "updating", () => {
      updateRenderer({
        layer: infectionsPopulationLayer,
        currentDate: slider.values[0],
        rendererType: rendererSelect.value as UpdateRendererParams["rendererType"]
      });
      updatePopupTemplate({
        layer: infectionsPopulationLayer,
        currentDate: slider.values[0],
        rendererType: rendererSelect.value as UpdateRendererParams["rendererType"]
      });
    });
  }

  function updateLayer (useExistingTemplate?: boolean) {
    updateRenderer({
      layer: infectionsPopulationLayer,
      currentDate: slider.values[0],
      rendererType: rendererSelect.value as UpdateRendererParams["rendererType"]
    });
    updatePopupTemplate({
      layer: infectionsPopulationLayer,
      currentDate: slider.values[0],
      rendererType: rendererSelect.value as UpdateRendererParams["rendererType"],
      existingTemplate: useExistingTemplate ? infectionsPopulationLayer.popupTemplate : null
    });
  }

  rendererSelect.addEventListener("change", () => {
    updateLayer(false);
  });

  await initializeLayer();
  slider.watch("values",  () => {
    updateLayer(true);
  });

})();