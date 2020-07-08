var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "esri/WebMap", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/TimeSlider", "esri/TimeInterval", "esri/core/watchUtils", "esri/Color", "esri/widgets/Legend", "esri/widgets/Expand", "esri/widgets/Zoom", "esri/widgets/Search", "esri/widgets/Search/LayerSearchSource", "./timeUtils", "./rendererUtils", "./popupTemplateUtils", "./layerUtils", "esri/renderers", "esri/symbols"], function (require, exports, WebMap, MapView, FeatureLayer, TimeSlider, TimeInterval, watchUtils, Color, Legend, Expand, Zoom, Search, LayerSearchSource, timeUtils_1, rendererUtils_1, popupTemplateUtils_1, layerUtils_1, renderers_1, symbols_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        function initializeLayer() {
            return __awaiter(this, void 0, void 0, function () {
                var activeLayerView;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            map.add(layerUtils_1.infectionsPopulationLayer);
                            return [4 /*yield*/, view.whenLayerView(layerUtils_1.infectionsPopulationLayer)];
                        case 1:
                            activeLayerView = _a.sent();
                            watchUtils.whenFalseOnce(activeLayerView, "updating", function () {
                                rendererUtils_1.updateRenderer({
                                    layer: layerUtils_1.infectionsPopulationLayer,
                                    currentDate: slider.values[0],
                                    rendererType: rendererSelect.value
                                });
                                popupTemplateUtils_1.updatePopupTemplate({
                                    layer: layerUtils_1.infectionsPopulationLayer,
                                    currentDate: slider.values[0],
                                    rendererType: rendererSelect.value
                                });
                            });
                            return [2 /*return*/];
                    }
                });
            });
        }
        function updateLayer(useExistingTemplate) {
            rendererUtils_1.updateRenderer({
                layer: layerUtils_1.infectionsPopulationLayer,
                currentDate: slider.values[0],
                endDate: slider.values[1] ? slider.values[1] : null,
                rendererType: rendererSelect.value
            });
            popupTemplateUtils_1.updatePopupTemplate({
                layer: layerUtils_1.infectionsPopulationLayer,
                currentDate: slider.values[1] ? slider.values[1] : slider.values[0],
                rendererType: rendererSelect.value,
                existingTemplate: useExistingTemplate ? layerUtils_1.infectionsPopulationLayer.popupTemplate : null
            });
        }
        var rendererSelect, wkid, map, view, search, slider, checkbox, updateSlider, timeVisibilityBtn, timeOptions, btns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rendererSelect = document.getElementById("renderer-select");
                    wkid = 102008;
                    map = new WebMap({
                        basemap: {
                            baseLayers: [
                                new FeatureLayer({
                                    portalItem: {
                                        id: "2b93b06dc0dc4e809d3c8db5cb96ba69"
                                    },
                                    spatialReference: {
                                        wkid: wkid
                                    },
                                    popupEnabled: false,
                                    renderer: new renderers_1.SimpleRenderer({
                                        symbol: new symbols_1.SimpleFillSymbol({
                                            color: new Color("#f3f3f3"),
                                            outline: new symbols_1.SimpleLineSymbol({
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
                                        wkid: wkid
                                    },
                                    minScale: 25000000,
                                    maxScale: 0,
                                    popupEnabled: false,
                                    renderer: new renderers_1.SimpleRenderer({
                                        symbol: new symbols_1.SimpleFillSymbol({
                                            color: new Color("#f3f3f3"),
                                            style: "none",
                                            outline: new symbols_1.SimpleLineSymbol({
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
                                                expression: "$feature.NAME"
                                            },
                                            symbol: new symbols_1.TextSymbol({
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
                                        wkid: wkid
                                    },
                                    minScale: 3000000,
                                    maxScale: 0,
                                    popupEnabled: false,
                                    renderer: new renderers_1.SimpleRenderer({
                                        symbol: new symbols_1.SimpleFillSymbol({
                                            color: new Color("#f3f3f3"),
                                            style: "none",
                                            outline: new symbols_1.SimpleLineSymbol({
                                                color: new Color("#cfd3d4"),
                                                width: 0.25
                                            })
                                        })
                                    })
                                })
                            ]
                        }
                    });
                    view = new MapView({
                        container: "viewDiv",
                        map: map,
                        center: {
                            "spatialReference": {
                                "wkid": 102008
                            },
                            "x": 261127.07789336453,
                            "y": -658046.0897695143
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
                            components: ["attribution"]
                        }
                    });
                    search = new Search({
                        view: view,
                        includeDefaultSources: false,
                        sources: [
                            new LayerSearchSource({
                                layer: layerUtils_1.infectionsPopulationLayer,
                                searchFields: ["Admin2", "Province_State"],
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
                        view: view,
                        container: "legend"
                    });
                    view.ui.add(new Expand({
                        view: view,
                        content: document.getElementById("ui-controls"),
                        expandIconClass: "esri-icon-menu",
                        expanded: true
                    }), "top-right");
                    view.ui.add(new Zoom({ view: view }), "bottom-right");
                    view.ui.add(new Expand({
                        view: view,
                        content: search
                    }), "top-left");
                    slider = new TimeSlider({
                        container: "timeSlider",
                        playRate: 100,
                        fullTimeExtent: timeUtils_1.initialTimeExtent,
                        mode: "instant",
                        values: [timeUtils_1.initialTimeExtent.end],
                        stops: {
                            interval: new TimeInterval({
                                value: 1,
                                unit: "days"
                            })
                        },
                        layout: "compact",
                        view: view
                    });
                    checkbox = document.getElementById("difference");
                    checkbox.addEventListener("input", function (event) {
                        if (checkbox.checked) {
                            updateSlider({ mode: "time-window" });
                        }
                        else {
                            updateSlider({ mode: "instant" });
                        }
                    });
                    updateSlider = function (params) {
                        var mode = params.mode, filter = params.filter;
                        var newMode = mode || slider.mode;
                        slider.mode = newMode;
                        if (newMode === "time-window") {
                            if (filter) {
                                slider.values = [
                                    timeUtils_1.timeExtents[filter].start,
                                    timeUtils_1.timeExtents[filter].end
                                ];
                            }
                            else {
                                slider.values = [
                                    timeUtils_1.timeExtents["month"].start,
                                    timeUtils_1.timeExtents["month"].end
                                ];
                            }
                        }
                        else {
                            if (filter) {
                                slider.values = [
                                    timeUtils_1.timeExtents[filter].start
                                ];
                            }
                            else {
                                slider.values = [
                                    slider.fullTimeExtent.end
                                ];
                            }
                        }
                    };
                    view.ui.add("timeOptions", "bottom-center");
                    timeVisibilityBtn = document.getElementById("time-slider-toggle");
                    timeOptions = document.getElementById("timeOptions");
                    btns = [].slice.call(document.getElementsByTagName("button"));
                    btns.forEach(function (btn) {
                        if (Object.keys(timeUtils_1.timeExtents).indexOf(btn.id) > -1) {
                            btn.addEventListener("click", function () {
                                updateSlider({ filter: btn.id });
                            });
                        }
                    });
                    timeVisibilityBtn.addEventListener("click", function () {
                        timeOptions.style.visibility = timeOptions.style.visibility === "visible" ? "hidden" : "visible";
                        if (timeVisibilityBtn.classList.contains("esri-icon-time-clock")) {
                            timeVisibilityBtn.classList.replace("esri-icon-time-clock", "esri-icon-expand");
                        }
                        else {
                            timeVisibilityBtn.classList.replace("esri-icon-expand", "esri-icon-time-clock");
                        }
                    });
                    rendererSelect.addEventListener("change", function () {
                        updateLayer(false);
                    });
                    return [4 /*yield*/, initializeLayer()];
                case 1:
                    _a.sent();
                    slider.watch("values", function () {
                        if (slider.viewModel.state === "playing") {
                            // don't generate popupTemplate when slider is playing
                            rendererUtils_1.updateRenderer({
                                layer: layerUtils_1.infectionsPopulationLayer,
                                currentDate: slider.values[0],
                                endDate: slider.values[1] ? slider.values[1] : null,
                                rendererType: rendererSelect.value
                            });
                        }
                        else {
                            updateLayer(true);
                        }
                    });
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=main.js.map