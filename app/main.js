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
define(["require", "exports", "esri/WebMap", "esri/views/MapView", "esri/core/lang", "esri/layers/FeatureLayer", "esri/widgets/TimeSlider", "esri/TimeInterval", "esri/core/watchUtils", "esri/Color", "esri/widgets/Legend", "esri/widgets/Expand", "esri/widgets/Zoom", "esri/widgets/Home", "esri/widgets/Search", "esri/widgets/Search/LayerSearchSource", "./timeUtils", "./rendererUtils", "./popupTemplateUtils", "./layerUtils", "esri/renderers", "esri/symbols", "./statistics", "esri/intl"], function (require, exports, WebMap, MapView, lang, FeatureLayer, TimeSlider, TimeInterval, watchUtils, Color, Legend, Expand, Zoom, Home, Search, LayerSearchSource, timeUtils_1, rendererUtils_1, popupTemplateUtils_1, layerUtils_1, renderers_1, symbols_1, statistics_1, intl_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        function loadApp() {
            return __awaiter(this, void 0, void 0, function () {
                function toggleTimeOptionsVisibility() {
                    timeOptions.style.visibility = timeOptions.style.visibility === "visible" ? "hidden" : "visible";
                    infoElement.style.visibility = !isMobileBrowser() && infoElement.style.visibility === "hidden" ? "visible" : "hidden";
                    if (timeVisibilityBtn.classList.contains("esri-icon-time-clock")) {
                        timeVisibilityBtn.classList.replace("esri-icon-time-clock", "esri-icon-expand");
                    }
                    else {
                        timeVisibilityBtn.classList.replace("esri-icon-expand", "esri-icon-time-clock");
                    }
                }
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
                                    updateStats();
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
                function updateStats() {
                    return __awaiter(this, void 0, void 0, function () {
                        var stats, format, dateOptions;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, statistics_1.getStats({
                                        layer: layerUtils_1.infectionsPopulationLayer,
                                        startDate: slider.values[0],
                                        endDate: slider.values.length > 1 ? slider.values[1] : null
                                    })];
                                case 1:
                                    stats = _a.sent();
                                    format = intl_1.convertNumberFormatToIntlOptions({
                                        places: 0,
                                        digitSeparator: true
                                    });
                                    dateOptions = intl_1.convertDateFormatToIntlOptions("long-month-day-year");
                                    if (slider.values.length > 1) {
                                        displayDateElement.innerText = intl_1.formatDate(slider.values[0], dateOptions) + " - " + intl_1.formatDate(slider.values[1], dateOptions);
                                    }
                                    else {
                                        displayDateElement.innerText = intl_1.formatDate(slider.values[0], dateOptions);
                                    }
                                    activeCountElement.innerText = intl_1.formatNumber(stats.active, format);
                                    recoveredCountElement.innerText = intl_1.formatNumber(stats.recovered, format);
                                    deathCountElement.innerText = intl_1.formatNumber(stats.deaths, format);
                                    activeRateElement.innerText = intl_1.formatNumber(stats.activeRate, format);
                                    deathRateElement.innerText = intl_1.formatNumber(stats.deathRate, format);
                                    recoveredRateElement.innerText = intl_1.formatNumber(stats.recoveredRate, format);
                                    return [2 /*return*/];
                            }
                        });
                    });
                }
                var rendererSelect, wkid, outlineColor, textColor, map, view, search, activeCountElement, recoveredCountElement, deathCountElement, displayDateElement, activeRateElement, deathRateElement, recoveredRateElement, slider, checkbox, btns, updateSlider, timeVisibilityBtn, timeOptions, infoElement, infoToggleButton, toggleInfoVisibility;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, timeUtils_1.setEndDate(new Date(2020, 11, 31))];
                        case 1:
                            _a.sent();
                            // display the body style so message or content renders
                            document.body.style.visibility = "visible";
                            rendererSelect = document.getElementById("renderer-select");
                            wkid = 102008;
                            outlineColor = [214, 214, 214, 0.5];
                            textColor = [163, 162, 162, 0.7];
                            map = new WebMap({
                                basemap: {
                                    baseLayers: [
                                        new FeatureLayer({
                                            title: null,
                                            portalItem: {
                                                id: layerUtils_1.polygonFillPortalItemId
                                            },
                                            layerId: layerUtils_1.polygonFillLayerId,
                                            outFields: ["Admin2"],
                                            labelingInfo: [{
                                                    labelExpressionInfo: {
                                                        expression: "$feature.Admin2"
                                                    },
                                                    symbol: new symbols_1.TextSymbol({
                                                        font: {
                                                            family: "Noto Sans",
                                                            size: 12,
                                                            weight: "lighter"
                                                        },
                                                        haloColor: new Color(textColor),
                                                        haloSize: 0.8,
                                                        color: new Color(layerUtils_1.fillColor)
                                                    }),
                                                    minScale: 1500000
                                                }],
                                            spatialReference: {
                                                wkid: wkid
                                            },
                                            minScale: 0,
                                            maxScale: 0,
                                            popupEnabled: false,
                                            renderer: new renderers_1.SimpleRenderer({
                                                symbol: new symbols_1.SimpleFillSymbol({
                                                    color: new Color(layerUtils_1.fillColor),
                                                    outline: new symbols_1.SimpleLineSymbol({
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
                                                wkid: wkid
                                            },
                                            minScale: 25000000,
                                            maxScale: 1500000,
                                            popupEnabled: false,
                                            renderer: new renderers_1.SimpleRenderer({
                                                symbol: new symbols_1.SimpleFillSymbol({
                                                    color: new Color(layerUtils_1.fillColor),
                                                    style: "none",
                                                    outline: new symbols_1.SimpleLineSymbol({
                                                        color: new Color([200, 200, 200, 0.3]),
                                                        width: 0.7
                                                    })
                                                })
                                            })
                                        }),
                                        layerUtils_1.citiesContextLayer
                                    ]
                                }
                            });
                            view = new MapView({
                                container: "viewDiv",
                                map: map,
                                extent: {
                                    spatialReference: {
                                        wkid: wkid
                                    },
                                    xmin: -3100906,
                                    ymin: -2531665,
                                    xmax: 4190495,
                                    ymax: 1602192
                                },
                                spatialReference: {
                                    wkid: wkid
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
                            view.ui.add(new Home({ view: view }), "top-left");
                            view.ui.add("time-slider-toggle", "bottom-left");
                            activeCountElement = document.getElementById("active-count");
                            recoveredCountElement = document.getElementById("recovered-count");
                            deathCountElement = document.getElementById("death-count");
                            displayDateElement = document.getElementById("display-date");
                            activeRateElement = document.getElementById("active-rate");
                            deathRateElement = document.getElementById("death-rate");
                            recoveredRateElement = document.getElementById("recovered-rate");
                            view.ui.add("statistics", "top-center");
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
                                }
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
                            btns = [].slice.call(document.getElementsByTagName("button"));
                            btns.forEach(function (btn) {
                                if (Object.keys(timeUtils_1.timeExtents).indexOf(btn.id) > -1) {
                                    btn.addEventListener("click", function () {
                                        updateSlider({ filter: btn.id });
                                    });
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
                                btns[0].innerText = (newMode === "time-window") ? "Since Labor Day" : "Labor Day";
                                btns[1].innerText = (newMode === "time-window") ? "Since Thanksgiving" : "Thanksgiving";
                                btns[2].innerText = (newMode === "time-window") ? "Since Christmas" : "Christmas";
                                btns[3].innerText = (newMode === "time-window") ? "Since Sturgis" : "Sturgis";
                                btns[4].innerText = (newMode === "time-window") ? "Last month" : "One month ago";
                                btns[5].innerText = (newMode === "time-window") ? "Last 2 weeks" : "Two weeks ago";
                            };
                            view.ui.add("timeOptions", "bottom-center");
                            timeVisibilityBtn = document.getElementById("time-slider-toggle");
                            timeOptions = document.getElementById("timeOptions");
                            infoElement = document.getElementById("info");
                            infoToggleButton = document.getElementById("info-toggle");
                            view.ui.add(infoToggleButton, "top-left");
                            timeVisibilityBtn.addEventListener("click", toggleTimeOptionsVisibility);
                            rendererSelect.addEventListener("change", function () {
                                updateLayer(false);
                            });
                            if (isMobileBrowser()) {
                                layerUtils_1.infectionsPopulationLayer.popupEnabled = false;
                                view.constraints.minScale = lang.clone(view.constraints.minScale) * 2;
                                toggleTimeOptionsVisibility();
                                infoElement.style.position = null;
                                infoElement.style.left = null;
                                infoElement.style.bottom = "100px";
                                infoToggleButton.style.visibility = "visible";
                                toggleInfoVisibility = function () {
                                    infoElement.style.visibility = infoElement.style.visibility === "hidden" ? "visible" : "hidden";
                                    if (infoElement.classList.contains("esri-icon-table")) {
                                        infoElement.classList.replace("esri-icon-table", "esri-icon-expand");
                                    }
                                    else {
                                        infoElement.classList.replace("esri-icon-expand", "esri-icon-table");
                                    }
                                };
                                infoToggleButton.addEventListener("click", toggleInfoVisibility);
                            }
                            return [4 /*yield*/, initializeLayer()];
                        case 2:
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
                                updateStats();
                            });
                            slider.viewModel.watch("state", function (state) {
                                slider.loop = !(state === "playing");
                            });
                            return [2 /*return*/];
                    }
                });
            });
        }
        var isMobileBrowser;
        return __generator(this, function (_a) {
            isMobileBrowser = function () {
                var check = false;
                (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                    check = true; })(navigator.userAgent || navigator.vendor || window.opera);
                return check;
            };
            loadApp();
            return [2 /*return*/];
        });
    }); })();
});
//# sourceMappingURL=main.js.map