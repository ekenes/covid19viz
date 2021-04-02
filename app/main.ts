import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");
import lang = require("esri/core/lang");

import FeatureLayer = require("esri/layers/FeatureLayer");
import TimeSlider = require("esri/widgets/TimeSlider");
import TimeInterval = require("esri/TimeInterval");
import watchUtils = require("esri/core/watchUtils");

import Color = require("esri/Color");

import Legend = require("esri/widgets/Legend");
import Expand = require("esri/widgets/Expand");
import Zoom = require("esri/widgets/Zoom");
import Home = require("esri/widgets/Home")
import Search = require("esri/widgets/Search");
import LayerSearchSource = require("esri/widgets/Search/LayerSearchSource");

import { initialTimeExtent, setEndDate, timeExtents } from "./timeUtils";
import { updateRenderer, UpdateRendererParams } from "./rendererUtils";
import { updatePopupTemplate } from "./popupTemplateUtils";
import { infectionsPopulationLayer, polygonFillPortalItemId, polygonFillLayerId, citiesContextLayer, fillColor } from "./layerUtils";
import { SimpleRenderer } from "esri/renderers";
import { SimpleFillSymbol, SimpleLineSymbol, TextSymbol } from "esri/symbols";
import { getStats } from "./statistics";
import { formatNumber, convertNumberFormatToIntlOptions, formatDate, convertDateFormatToIntlOptions } from "esri/intl";

(async () => {

  // Don't load app resources if mobile device is used.

  const isMobileBrowser = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||(window as any).opera);
    return check;
  };
  loadApp();

  async function loadApp() {
    await setEndDate(new Date(2020, 11, 31));
    // display the body style so message or content renders
    document.body.style.visibility = "visible";

    const rendererSelect = document.getElementById("renderer-select") as HTMLSelectElement;

    //102008
    const wkid = 102008;
    const outlineColor = [214, 214, 214,0.5];
    const textColor = [163, 162, 162,0.7]

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
                haloColor: new Color(textColor),
                haloSize: 0.8,
                color: new Color(fillColor)
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
                color: new Color(fillColor),
                outline: new SimpleLineSymbol({
                  color: new Color(outlineColor),
                  width: 0.3
                })
              })
            })
          })
        ],
        referenceLayers: [
          new FeatureLayer({
            portalItem: {
              id: "99fd67933e754a1181cc755146be21ca"
            },
            spatialReference: {
              wkid
            },
            minScale: 25000000,
            maxScale: 1500000,
            popupEnabled: false,
            renderer: new SimpleRenderer({
              symbol: new SimpleFillSymbol({
                color: new Color(fillColor),
                style: "none",
                outline: new SimpleLineSymbol({
                  color: new Color([200,200,200,0.3]),
                  width: 0.7
                })
              })
            })
          }),
          citiesContextLayer
        ]
      }
    });

    const view = new MapView({
      container: "viewDiv",
      map: map,
      extent: {
        spatialReference: {
          wkid
        },
        xmin: -3100906,
        ymin: -2531665,
        xmax: 4190495,
        ymax: 1602192
      },
      spatialReference: {
        wkid
      },
      constraints: {
        minScale: 25000000,
        maxScale: 200000,
        rotationEnabled: false
      },
      popup: {
        dockEnabled: true,
        dockOptions: {
          breakpoint: false,
          position: "top-right"
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

    view.ui.add( new Home({ view }), "top-left");
    view.ui.add("time-slider-toggle", "bottom-left");

    const activeCountElement = document.getElementById("active-count");
    const recoveredCountElement = document.getElementById("recovered-count");
    const deathCountElement = document.getElementById("death-count");
    const displayDateElement = document.getElementById("display-date");
    const activeRateElement = document.getElementById("active-rate");
    const deathRateElement = document.getElementById("death-rate");
    const recoveredRateElement = document.getElementById("recovered-rate");
    view.ui.add("statistics", "top-center");

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
      }
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

    const btns = [].slice.call(document.getElementsByTagName("button"));

    btns.forEach( (btn: HTMLButtonElement) => {
      if(Object.keys(timeExtents).indexOf(btn.id) > -1){
        btn.addEventListener( "click", () => {
          updateSlider({ filter: btn.id });
        });
      }
    });

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

      btns[0].innerText = (newMode === "time-window") ? "Since Labor Day" : "Labor Day";
      btns[1].innerText = (newMode === "time-window") ? "Since Thanksgiving" : "Thanksgiving";
      btns[2].innerText = (newMode === "time-window") ? "Since Christmas" : "Christmas";
      btns[3].innerText = (newMode === "time-window") ? "Since Sturgis" : "Sturgis";
      btns[4].innerText = (newMode === "time-window") ? "Last month" : "One month ago";
      btns[5].innerText = (newMode === "time-window") ? "Last 2 weeks" : "Two weeks ago";
    };

    view.ui.add("timeOptions", "bottom-center");

    const timeVisibilityBtn = document.getElementById("time-slider-toggle");
    const timeOptions = document.getElementById("timeOptions");
    const infoElement = document.getElementById("info");

    const infoToggleButton = document.getElementById("info-toggle");
    view.ui.add(infoToggleButton, "top-left");

    timeVisibilityBtn.addEventListener("click", toggleTimeOptionsVisibility);

    function toggleTimeOptionsVisibility() {
      timeOptions.style.visibility = timeOptions.style.visibility === "visible" ? "hidden" : "visible";
      infoElement.style.visibility = !isMobileBrowser() && infoElement.style.visibility === "hidden" ? "visible" : "hidden";

      if(timeVisibilityBtn.classList.contains("esri-icon-time-clock")){
        timeVisibilityBtn.classList.replace("esri-icon-time-clock", "esri-icon-expand");
      } else {
        timeVisibilityBtn.classList.replace("esri-icon-expand", "esri-icon-time-clock");
      }

    }

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

      updateStats();
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

    if(isMobileBrowser()){
      infectionsPopulationLayer.popupEnabled = false;
      view.constraints.minScale = lang.clone(view.constraints.minScale) * 2;
      toggleTimeOptionsVisibility();

      infoElement.style.position = null;
      infoElement.style.left = null;
      infoElement.style.bottom = "100px";

      infoToggleButton.style.visibility = "visible";

      const toggleInfoVisibility = function () {
        infoElement.style.visibility = infoElement.style.visibility === "hidden" ? "visible" : "hidden";

        if(infoElement.classList.contains("esri-icon-table")){
          infoElement.classList.replace("esri-icon-table", "esri-icon-expand");
        } else {
          infoElement.classList.replace("esri-icon-expand", "esri-icon-table");
        }
      }

      infoToggleButton.addEventListener("click", toggleInfoVisibility);
    }

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

      updateStats();
    });

    slider.viewModel.watch("state", (state: TimeSlider["viewModel"]["state"]) => {
      slider.loop = !(state === "playing");
    });

    async function updateStats(){
      const stats = await getStats({
        layer: infectionsPopulationLayer,
        startDate: slider.values[0],
        endDate: slider.values.length > 1 ? slider.values[1] : null
      });

      const format = convertNumberFormatToIntlOptions({
        places: 0,
        digitSeparator: true
      });

      const dateOptions = convertDateFormatToIntlOptions("long-month-day-year");
      if (slider.values.length > 1){
        displayDateElement.innerText = `${formatDate(slider.values[0], dateOptions)} - ${formatDate(slider.values[1], dateOptions)}`;
      } else {
        displayDateElement.innerText = formatDate(slider.values[0], dateOptions);
      }
      activeCountElement.innerText = formatNumber(stats.active, format);
      recoveredCountElement.innerText = formatNumber(stats.recovered, format);
      deathCountElement.innerText = formatNumber(stats.deaths, format);
      activeRateElement.innerText = formatNumber(stats.activeRate, format);
      deathRateElement.innerText = formatNumber(stats.deathRate, format);
      recoveredRateElement.innerText = formatNumber(stats.recoveredRate, format);
    }
  }


})();