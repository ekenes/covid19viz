define(["require", "exports", "esri/renderers/SimpleRenderer", "esri/renderers/visualVariables/ColorVariable", "esri/renderers/visualVariables/SizeVariable", "esri/renderers/visualVariables/OpacityVariable", "esri/Color", "./timeUtils", "./expressionUtils", "esri/symbols", "./rendererRangeUtils"], function (require, exports, SimpleRenderer, ColorVariable, SizeVariable, OpacityVariable, Color, timeUtils_1, expressionUtils_1, symbols_1, rendererRangeUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RendererVars = /** @class */ (function () {
        function RendererVars() {
        }
        RendererVars.activeRendererType = "total-infections";
        return RendererVars;
    }());
    exports.RendererVars = RendererVars;
    function updateRenderer(params) {
        var layer = params.layer, rendererType = params.rendererType, currentDate = params.currentDate, endDate = params.endDate;
        var renderer;
        renderer = rendererRangeUtils_1.updateRangeRenderer(params);
        layer.renderer = renderer;
        return;
        switch (rendererType) {
            case "total-infections":
                renderer = createInfectionAccumulatedRenderer({
                    currentDate: currentDate
                });
                break;
            case "doubling-time":
                renderer = createDoublingTimeRenderer({
                    currentDate: currentDate
                });
                break;
            case "total-deaths":
                renderer = createDeathsAccumulatedRenderer({
                    currentDate: currentDate
                });
                break;
            case "total-active":
                renderer = createActiveCasesTotalSizeRenderer({
                    currentDate: currentDate
                });
                break;
            case "active-rate":
                renderer = createActiveRateFillRenderer({
                    currentDate: currentDate
                });
                break;
            case "infection-rate-per-100k":
                renderer = createInfectionRateFillRenderer({
                    currentDate: currentDate
                });
                break;
            case "death-rate":
                renderer = createDeathRateRenderer({
                    currentDate: currentDate
                });
                break;
            case "total-color":
                renderer = createColorAccumulatedRenderer({
                    currentDate: currentDate
                });
                break;
            case "new-total":
                renderer = createSizeNewInfectionsRenderer({
                    currentDate: currentDate
                });
                break;
            case "total-color-new-total-size":
                renderer = createTotalsRenderer({
                    currentDate: currentDate
                });
                break;
            default:
                break;
        }
        layer.renderer = renderer;
    }
    exports.updateRenderer = updateRenderer;
    function createInfectionAccumulatedRenderer(params) {
        var currentDate = params.currentDate;
        var currentDateFieldName = timeUtils_1.getFieldFromDate(currentDate);
        return new SimpleRenderer({
            symbol: createDefaultSymbol(null, new symbols_1.SimpleLineSymbol({
                color: new Color("rgba(227, 0, 106,0.6)"),
                width: 0.5
            })),
            label: "County",
            visualVariables: [
                new SizeVariable({
                    valueExpression: expressionUtils_1.createTotalInfectionsExpression(currentDateFieldName),
                    legendOptions: {
                        title: "Total COVID-19 cases as of " + timeUtils_1.formatDate(currentDate)
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
    function createDeathsAccumulatedRenderer(params) {
        var currentDate = params.currentDate;
        var currentDateFieldName = timeUtils_1.getFieldFromDate(currentDate);
        return new SimpleRenderer({
            symbol: createDefaultSymbol(null, new symbols_1.SimpleLineSymbol({
                color: new Color("rgba(227, 0, 106,0.6)"),
                width: 0.5
            })),
            label: "County",
            visualVariables: [
                new SizeVariable({
                    valueExpressionTitle: "Total deaths",
                    valueExpression: expressionUtils_1.createTotalDeathsExpression(currentDateFieldName),
                    legendOptions: {
                        title: "Total COVID-19 deaths as of " + timeUtils_1.formatDate(currentDate)
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
    function createColorAccumulatedRenderer(params) {
        var currentDate = params.currentDate;
        var colors = ["#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c"];
        var currentDateFieldName = timeUtils_1.getFieldFromDate(currentDate);
        return new SimpleRenderer({
            symbol: createDefaultSymbol(new Color("gray"), new symbols_1.SimpleLineSymbol({
                color: "rgba(128,128,128,0.8)",
                width: 0
            })),
            visualVariables: [
                new ColorVariable({
                    valueExpression: expressionUtils_1.createTotalInfectionsExpression(currentDateFieldName),
                    legendOptions: {
                        title: "Total COVID-19 cases as of " + timeUtils_1.formatDate(currentDate)
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
    function createSizeNewInfectionsRenderer(params) {
        var currentDate = params.currentDate;
        var currentDateFieldName = timeUtils_1.getFieldFromDate(currentDate);
        return new SimpleRenderer({
            symbol: createDefaultSymbol(null, new symbols_1.SimpleLineSymbol({
                color: new Color("rgba(222, 18, 222, 0.5)"),
                width: 0.5
            })),
            label: "County",
            visualVariables: [new SizeVariable({
                    valueExpressionTitle: "New COVID-19 cases reported on " + currentDateFieldName,
                    valueExpression: expressionUtils_1.createNewInfectionsExpression(currentDateFieldName),
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
    function createActiveCasesTotalSizeRenderer(params) {
        var currentDate = params.currentDate;
        var currentDateFieldName = timeUtils_1.getFieldFromDate(currentDate);
        return new SimpleRenderer({
            symbol: createDefaultSymbol(null, new symbols_1.SimpleLineSymbol({
                color: new Color("rgba(222, 18, 222, 1)"),
                width: 0.5
            })),
            label: "County",
            visualVariables: [new SizeVariable({
                    valueExpressionTitle: "Active COVID-19 cases on " + timeUtils_1.formatDate(currentDate),
                    valueExpression: expressionUtils_1.createActiveCasesExpression(currentDateFieldName),
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
    function createDoublingTimeRenderer(params) {
        var currentDate = params.currentDate;
        var colors = ["#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c"];
        var currentDateFieldName = timeUtils_1.getFieldFromDate(currentDate);
        var valueExpression = expressionUtils_1.createDoublingTimeExpression(currentDateFieldName);
        return new SimpleRenderer({
            symbol: createDefaultSymbol(new Color("#f7f7f7")),
            label: "County",
            visualVariables: [
                new SizeVariable({
                    valueExpression: expressionUtils_1.createTotalInfectionsExpression(currentDateFieldName),
                    legendOptions: {
                        title: "Total COVID-19 cases as of " + timeUtils_1.formatDate(currentDate)
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
                    valueExpression: valueExpression,
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
                    valueExpression: valueExpression,
                    stops: [
                        { value: 7, opacity: 1 },
                        { value: 14, opacity: 0.6 },
                        { value: 28, opacity: 0.4 }
                    ]
                })
            ]
        });
    }
    function createDeathRateRenderer(params) {
        var currentDate = params.currentDate;
        var colors = ["#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c"];
        var currentDateFieldName = timeUtils_1.getFieldFromDate(currentDate);
        return new SimpleRenderer({
            symbol: createDefaultSymbol(new Color("#f7f7f7")),
            label: "County",
            visualVariables: [
                new SizeVariable({
                    valueExpressionTitle: "Total deaths",
                    valueExpression: expressionUtils_1.createTotalDeathsExpression(currentDateFieldName),
                    legendOptions: {
                        title: "Total COVID-19 deaths as of " + timeUtils_1.formatDate(currentDate)
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
                    valueExpression: expressionUtils_1.createDeathRateExpression(currentDateFieldName),
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
    function createTotalsRenderer(params) {
        var currentDate = params.currentDate;
        var colors = ["#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c"];
        var currentDateFieldName = timeUtils_1.getFieldFromDate(currentDate);
        return new SimpleRenderer({
            symbol: createDefaultSymbol(new Color("#f7f7f7"), new symbols_1.SimpleLineSymbol({
                color: "rgba(102, 2, 2,0.2)",
                width: 0.4
            })),
            label: "County",
            visualVariables: [
                new SizeVariable({
                    valueExpression: expressionUtils_1.createNewInfectionsExpression(currentDateFieldName),
                    valueExpressionTitle: "Reported cases on " + currentDateFieldName,
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
                        title: "Total cases since " + timeUtils_1.getFieldFromDate(timeUtils_1.initialTimeExtent.start)
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
    function createInfectionRateFillRenderer(params) {
        var currentDate = params.currentDate;
        var colors = ["#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c"];
        var currentDateFieldName = timeUtils_1.getFieldFromDate(currentDate);
        return new SimpleRenderer({
            symbol: new symbols_1.SimpleFillSymbol({
                outline: new symbols_1.SimpleLineSymbol({
                    color: "rgba(128,128,128,0.4)",
                    width: 0
                })
            }),
            label: "County",
            visualVariables: [
                new ColorVariable({
                    valueExpression: expressionUtils_1.createInfectionRateExpression(currentDateFieldName),
                    valueExpressionTitle: "Total COVID-19 cases per 100k people",
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
    function createActiveRateFillRenderer(params) {
        var currentDate = params.currentDate;
        var colors = ["#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c"];
        var currentDateFieldName = timeUtils_1.getFieldFromDate(currentDate);
        return new SimpleRenderer({
            symbol: new symbols_1.SimpleFillSymbol({
                outline: new symbols_1.SimpleLineSymbol({
                    color: "rgba(128,128,128,0.4)",
                    width: 0
                }),
            }),
            label: "County",
            visualVariables: [
                new ColorVariable({
                    valueExpression: expressionUtils_1.createActiveCasesPer100kExpression(currentDateFieldName),
                    valueExpressionTitle: "Active COVID-19 cases per 100k people",
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
    function createDefaultSymbol(color, outline) {
        return new symbols_1.SimpleMarkerSymbol({
            color: color || null,
            size: 4,
            outline: outline || {
                color: "rgba(200,200,200,0.4)",
                width: 0.5
            }
        });
    }
});
//# sourceMappingURL=rendererUtils.js.map