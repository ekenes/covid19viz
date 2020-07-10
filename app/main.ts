import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");

import FeatureLayer = require("esri/layers/FeatureLayer");
import VectorTileLayer = require("esri/layers/VectorTileLayer");
import TimeSlider = require("esri/widgets/TimeSlider");
import TimeInterval = require("esri/TimeInterval");
import watchUtils = require("esri/core/watchUtils");

import Color = require("esri/Color");

import Legend = require("esri/widgets/Legend");
import Expand = require("esri/widgets/Expand");
import Zoom = require("esri/widgets/Zoom");
import Search = require("esri/widgets/Search");
import LayerSearchSource = require("esri/widgets/Search/LayerSearchSource");

import { initialTimeExtent, timeExtents } from "./timeUtils";
import { updateRenderer, UpdateRendererParams } from "./rendererUtils";
import { updatePopupTemplate } from "./popupTemplateUtils";
import { infectionsPopulationLayer, polygonFillPortalItemId, polygonFillLayerId } from "./layerUtils";
import { SimpleRenderer } from "esri/renderers";
import { SimpleFillSymbol, SimpleLineSymbol, TextSymbol } from "esri/symbols";

(async () => {

  const rendererSelect = document.getElementById("renderer-select") as HTMLSelectElement;

  //102008
  const wkid = 102008;

  const map = new WebMap({
    basemap: {
      baseLayers: [
        new FeatureLayer({
          title: null,
          portalItem: {
            id: polygonFillPortalItemId
          },
          layerId: polygonFillLayerId,
          outFields: ["Admin2"],
          labelingInfo: [{
            labelExpressionInfo: {
              expression: `$feature.Admin2`
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
            wkid
          },
          minScale: 0,
          maxScale: 0,
          popupEnabled: false,
          renderer: new SimpleRenderer({
            symbol: new SimpleFillSymbol({
              color: new Color("#ece8e8"),
              outline: new SimpleLineSymbol({
                color: new Color("#cfd3d4"),
                width: 0
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
      spatialReference: { wkid },
      x: 261127.07789336453,
      y: -658046.0897695143
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

  view.ui.add(new Expand({
    view,
    content: document.getElementById("ui-controls"),
    expandIconClass: "esri-icon-menu",
    expanded: true
  }) , "top-right");

  view.ui.add( new Zoom({ view }), "bottom-right");

  view.ui.add(new Expand({
    view,
    content: search
  }), "top-left");

  const slider = new TimeSlider({
    container: "timeSlider",
    playRate: 100,
    fullTimeExtent: initialTimeExtent,
    mode: "instant",
    values: [ initialTimeExtent.end ],
    stops: {
      interval: new TimeInterval({
        value: 1,
        unit: "days"
      })
    },
    view
  });

  const checkbox = document.getElementById("difference") as HTMLInputElement;

  checkbox.addEventListener( "input", (event) => {
    if(checkbox.checked){
      updateSlider({ mode: "time-window" });
    } else {
      updateSlider({ mode: "instant" });
    }
  });

  interface UpdateSliderParams {
    mode?: "time-window" | "instant",
    filter?: string
  }

  const updateSlider = (params: UpdateSliderParams) => {
    const { mode, filter } = params;
    const newMode = mode || slider.mode;
    slider.mode = newMode;
    if (newMode === "time-window"){
      if(filter){
        slider.values = [
          timeExtents[filter].start,
          timeExtents[filter].end
        ];
      } else {
        slider.values = [
          timeExtents["month"].start,
          timeExtents["month"].end
        ];
      }
    } else {
      if(filter){
        slider.values = [
          timeExtents[filter].start
        ];
      } else {
        slider.values = [
          slider.fullTimeExtent.end
        ];
      }
    }
  };

  view.ui.add("timeOptions", "bottom-center");

  const timeVisibilityBtn = document.getElementById("time-slider-toggle");
  const timeOptions = document.getElementById("timeOptions");
  const btns = [].slice.call(document.getElementsByTagName("button"));

  btns.forEach( (btn: HTMLButtonElement) => {
    if(Object.keys(timeExtents).indexOf(btn.id) > -1){
      btn.addEventListener( "click", () => {
        updateSlider({ filter: btn.id });
      });
    }
  });

  timeVisibilityBtn.addEventListener("click", () => {
    timeOptions.style.visibility = timeOptions.style.visibility === "visible" ? "hidden" : "visible";

    if(timeVisibilityBtn.classList.contains("esri-icon-time-clock")){
      timeVisibilityBtn.classList.replace("esri-icon-time-clock", "esri-icon-expand");
    } else {
      timeVisibilityBtn.classList.replace("esri-icon-expand", "esri-icon-time-clock");
    }

  });

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
      endDate: slider.values[1] ? slider.values[1] : null,
      rendererType: rendererSelect.value as UpdateRendererParams["rendererType"]
    });
    updatePopupTemplate({
      layer: infectionsPopulationLayer,
      currentDate: slider.values[1] ? slider.values[1] : slider.values[0],
      rendererType: rendererSelect.value as UpdateRendererParams["rendererType"],
      existingTemplate: useExistingTemplate ? infectionsPopulationLayer.popupTemplate : null
    });
  }

  rendererSelect.addEventListener("change", () => {
    updateLayer(false);
  });

  await initializeLayer();

  slider.watch("values",  () => {
    if (slider.viewModel.state === "playing"){
      // don't generate popupTemplate when slider is playing
      updateRenderer({
        layer: infectionsPopulationLayer,
        currentDate: slider.values[0],
        endDate: slider.values[1] ? slider.values[1] : null,
        rendererType: rendererSelect.value as UpdateRendererParams["rendererType"]
      });
    } else {
      updateLayer(true);
    }
  });

  slider.viewModel.watch("state", (state: TimeSlider["viewModel"]["state"]) => {
    slider.loop = !(state === "playing");
  });

})();