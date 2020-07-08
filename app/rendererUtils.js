define(["require", "exports", "esri/renderers/SimpleRenderer", "esri/renderers/visualVariables/ColorVariable", "esri/renderers/visualVariables/SizeVariable", "esri/renderers/visualVariables/OpacityVariable", "esri/Color", "esri/renderers/support/AttributeColorInfo", "./timeUtils", "./expressionUtils", "esri/symbols", "esri/renderers"], function (require, exports, SimpleRenderer, ColorVariable, SizeVariable, OpacityVariable, Color, AttributeColorInfo, timeUtils_1, expressionUtils_1, symbols_1, renderers_1) {
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
        var startDate = currentDate;
        var renderer;
        switch (rendererType) {
            case "total-infections":
                renderer = createTotalCasesRenderer({
                    startDate: startDate,
                    endDate: endDate
                });
                break;
            case "dot-density":
                renderer = createDotDensityRenderer({
                    startDate: startDate,
                    endDate: endDate
                });
                break;
            case "doubling-time":
                renderer = createDoublingTimeRenderer({
                    startDate: startDate,
                    endDate: endDate
                });
                break;
            case "total-deaths":
                renderer = createTotalDeathsRenderer({
                    startDate: startDate,
                    endDate: endDate
                });
                break;
            case "total-active":
                renderer = createActiveCasesRenderer({
                    startDate: startDate,
                    endDate: endDate
                });
                break;
            case "active-rate":
                renderer = createActiveRateRenderer({
                    startDate: startDate,
                    endDate: endDate
                });
                break;
            case "infection-rate-per-100k":
                renderer = createCaseRateRenderer({
                    startDate: startDate,
                    endDate: endDate
                });
                break;
            case "death-rate":
                renderer = createDeathRateRenderer({
                    startDate: startDate,
                    endDate: endDate
                });
                break;
            case "new-total":
                renderer = createNewCasesRenderer({
                    startDate: startDate,
                    endDate: endDate
                });
                break;
            default:
                break;
        }
        layer.renderer = renderer;
    }
    exports.updateRenderer = updateRenderer;
    var colorRamps = {
        light: [
            ["#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c"],
            ["#f6eff7", "#bdc9e1", "#67a9cf", "#1c9099", "#016c59"],
            ["#f1eef6", "#d7b5d8", "#df65b0", "#dd1c77", "#980043"],
            ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"],
            ["#54bebe", "#98d1d1", "#dedad2", "#df979e", "#c80064"],
            ["#8100e6", "#b360d1", "#f2cf9e", "#6eb830", "#2b9900"],
            ["#00998c", "#69d4cb", "#f2f2aa", "#d98346", "#b34a00"],
            ["#a6611a", "#dfc27d", "#f5f5f5", "#80cdc1", "#018571"]
        ],
        dark: [
            ["#0010d9", "#0040ff", "#0080ff", "#00bfff", "#00ffff"],
            ["#481295", "#6535a6", "#7d6aa1", "#9e97b8", "#c4bedc"],
            ["#00590f", "#008c1a", "#00bf25", "#76df13", "#d0ff00"],
            ["#3b3734", "#54504c", "#ab3da9", "#eb44e8", "#ff80ff"],
            ["#ff4d6a", "#a63245", "#453437", "#2b819b", "#23ccff"],
            ["#23ccff", "#2c8eac", "#42422f", "#9b9b15", "#ffff00"],
            ["#ff00ff", "#b21bb2", "#414537", "#76961d", "#beff00"],
            ["#ff00cc", "#b21c97", "#453442", "#96961d", "#ffff00"],
            ["#ff0099", "#aa1970", "#45343e", "#92781c", "#ffc800"],
            ["#e8ff00", "#97a41c", "#413f54", "#655dbb", "#8c80ff"]
        ],
        dotDensity: {
            light: [
                ["#e60049", "#d9dc00", "#000000"],
                ["#a03500", "#3264c8", "#72b38e"],
                ["#e60049", "#0bb4ff", "#50e991", "#9b19f5"],
                ["#1e8553", "#c44296", "#d97f00", "#00b6f1"],
                ["#0040bf", "#a3cc52", "#b9a087", "#a01fcc"],
                ["#dc4b00", "gray", "#000000"]
            ],
            dark: [
                ["#dc4b00", "#3c6ccc", "#d9dc00", "#91d900", "#986ba1"],
                ["#1e8553", "#c44296", "#d97f00", "#00b6f1"],
                ["#0040bf", "#a3cc52", "#a01fcc", "#5bb698"],
            ]
        }
    };
    var dateRangeConfig = {
        colors: colorRamps.light[2],
        stops: [0, 250, 500, 750, 1000]
    };
    function createTotalCasesRenderer(params) {
        var colors = colorRamps.light[1];
        var startDate = params.startDate, endDate = params.endDate;
        var startDateFieldName = timeUtils_1.getFieldFromDate(startDate);
        var visualVariables = null;
        if (endDate) {
            var endDateFieldName = timeUtils_1.getFieldFromDate(endDate);
            visualVariables = [
                new SizeVariable({
                    valueExpression: expressionUtils_1.expressionDifference(expressionUtils_1.createTotalInfectionsExpression(startDateFieldName), expressionUtils_1.createTotalInfectionsExpression(endDateFieldName)),
                    legendOptions: {
                        title: "New COVID-19 cases from " + timeUtils_1.formatDate(startDate) + " - " + timeUtils_1.formatDate(endDate)
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
                    valueExpression: expressionUtils_1.expressionPercentChange(expressionUtils_1.createTotalInfectionsExpression(startDateFieldName), expressionUtils_1.createTotalInfectionsExpression(endDateFieldName)),
                    legendOptions: {
                        title: "% increase in total cases from " + timeUtils_1.formatDate(startDate) + " - " + timeUtils_1.formatDate(endDate)
                    },
                    stops: [
                        { value: dateRangeConfig.stops[0], color: colors[0], label: "No increase" },
                        { value: dateRangeConfig.stops[1], color: colors[1] },
                        { value: dateRangeConfig.stops[2], color: colors[2], label: dateRangeConfig.stops[2] + "% increase" },
                        { value: dateRangeConfig.stops[3], color: colors[3] },
                        { value: dateRangeConfig.stops[4], color: colors[4], label: dateRangeConfig.stops[4].toLocaleString() + "% increase" }
                    ]
                }),
                new OpacityVariable({
                    valueExpression: expressionUtils_1.expressionPercentChange(expressionUtils_1.createTotalInfectionsExpression(startDateFieldName), expressionUtils_1.createTotalInfectionsExpression(endDateFieldName)),
                    legendOptions: {
                        showLegend: false
                    },
                    stops: [
                        { value: 0, opacity: 0.25 },
                        { value: 100, opacity: 0.65 },
                        { value: 300, opacity: 0.75 },
                        { value: 400, opacity: 0.85 },
                        { value: 500, opacity: 1 }
                    ]
                })
            ];
        }
        else {
            visualVariables = [new SizeVariable({
                    valueExpression: expressionUtils_1.createTotalInfectionsExpression(startDateFieldName),
                    legendOptions: {
                        title: "Total COVID-19 cases as of " + timeUtils_1.formatDate(startDate)
                    },
                    stops: [
                        { value: 0, size: 0 },
                        { value: 1, size: "2px" },
                        { value: 100, size: "4px" },
                        { value: 1000, size: "10px" },
                        { value: 10000, size: "50px" },
                        { value: 200000, size: "200px" }
                    ]
                })];
        }
        return new SimpleRenderer({
            symbol: endDate ? createDefaultSymbol() : createDefaultSymbol(null, new symbols_1.SimpleLineSymbol({
                color: new Color("rgba(227, 0, 106,0.6)"),
                width: 0.5
            })),
            label: "County",
            visualVariables: visualVariables
        });
    }
    function createDotDensityRenderer(params) {
        var colors = colorRamps.dotDensity.light[0];
        var startDate = params.startDate, endDate = params.endDate;
        var startDateFieldName = timeUtils_1.getFieldFromDate(startDate);
        var attributes;
        if (endDate) {
            var endDateFieldName = timeUtils_1.getFieldFromDate(endDate);
            var colors_1 = colorRamps.dotDensity.light[0];
            attributes = [
                new AttributeColorInfo({
                    color: colors_1[5],
                    valueExpressionTitle: "Cases from " + timeUtils_1.formatDate(startDate) + " - " + timeUtils_1.formatDate(endDate),
                    valueExpression: expressionUtils_1.expressionDifference(expressionUtils_1.createTotalInfectionsExpression(startDateFieldName), expressionUtils_1.createTotalInfectionsExpression(endDateFieldName)),
                }),
                new AttributeColorInfo({
                    color: colors_1[1],
                    valueExpressionTitle: "All cases",
                    valueExpression: expressionUtils_1.createTotalInfectionsExpression(startDateFieldName),
                })
            ];
        }
        else {
            attributes = [
                new AttributeColorInfo({
                    color: colors[0],
                    valueExpressionTitle: "Sick",
                    valueExpression: expressionUtils_1.createActiveCasesExpression(startDateFieldName),
                }),
                new AttributeColorInfo({
                    color: colors[1],
                    valueExpressionTitle: "Recovered",
                    valueExpression: expressionUtils_1.expressionDifference(expressionUtils_1.createActiveCasesExpression(startDateFieldName, true), expressionUtils_1.createTotalInfectionsExpression(startDateFieldName), true),
                }),
                new AttributeColorInfo({
                    color: colors[2],
                    valueExpressionTitle: "Deaths",
                    valueExpression: expressionUtils_1.createTotalDeathsExpression(startDateFieldName)
                })
            ];
        }
        return new renderers_1.DotDensityRenderer({
            dotValue: 10,
            referenceScale: null,
            attributes: attributes,
            outline: null,
            dotBlendingEnabled: true,
            legendOptions: {
                unit: "cases"
            }
        });
    }
    function createTotalDeathsRenderer(params) {
        var colors = colorRamps.light[1];
        var startDate = params.startDate, endDate = params.endDate;
        var startDateFieldName = timeUtils_1.getFieldFromDate(startDate);
        var visualVariables = null;
        if (endDate) {
            var endDateFieldName = timeUtils_1.getFieldFromDate(endDate);
            visualVariables = [
                new SizeVariable({
                    valueExpressionTitle: "Total deaths",
                    valueExpression: expressionUtils_1.expressionDifference(expressionUtils_1.createTotalDeathsExpression(startDateFieldName), expressionUtils_1.createTotalDeathsExpression(endDateFieldName)),
                    legendOptions: {
                        title: "Total COVID-19 deaths from " + timeUtils_1.formatDate(startDate) + " - " + timeUtils_1.formatDate(endDate)
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
                    valueExpression: expressionUtils_1.expressionPercentChange(expressionUtils_1.createTotalInfectionsExpression(startDateFieldName), expressionUtils_1.createTotalInfectionsExpression(endDateFieldName)),
                    legendOptions: {
                        title: "% increase in deaths from " + timeUtils_1.formatDate(startDate) + " - " + timeUtils_1.formatDate(endDate)
                    },
                    stops: [
                        { value: dateRangeConfig.stops[0], color: colors[0], label: "No increase" },
                        { value: dateRangeConfig.stops[1], color: colors[1] },
                        { value: dateRangeConfig.stops[2], color: colors[2], label: dateRangeConfig.stops[2] + "% increase" },
                        { value: dateRangeConfig.stops[3], color: colors[3] },
                        { value: dateRangeConfig.stops[4], color: colors[4], label: dateRangeConfig.stops[4].toLocaleString() + "% increase" }
                    ]
                }),
                new OpacityVariable({
                    valueExpression: expressionUtils_1.expressionPercentChange(expressionUtils_1.createTotalInfectionsExpression(startDateFieldName), expressionUtils_1.createTotalInfectionsExpression(endDateFieldName)),
                    legendOptions: {
                        showLegend: false
                    },
                    stops: [
                        { value: 0, opacity: 0.25 },
                        { value: 100, opacity: 0.65 },
                        { value: 300, opacity: 0.75 },
                        { value: 400, opacity: 0.85 },
                        { value: 500, opacity: 1 }
                    ]
                })
            ];
        }
        else {
            visualVariables = [
                new SizeVariable({
                    valueExpressionTitle: "Total deaths",
                    valueExpression: expressionUtils_1.createTotalDeathsExpression(startDateFieldName),
                    legendOptions: {
                        title: "Total COVID-19 deaths as of " + timeUtils_1.formatDate(startDate)
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
            ];
        }
        return new SimpleRenderer({
            symbol: createDefaultSymbol(null, new symbols_1.SimpleLineSymbol({
                color: new Color("rgba(227, 0, 106,0.6)"),
                width: endDate ? 0 : 0.5
            })),
            label: "County",
            visualVariables: visualVariables
        });
    }
    function createNewCasesRenderer(params) {
        var startDate = params.startDate, endDate = params.endDate;
        var startDateFieldName = timeUtils_1.getFieldFromDate(startDate);
        var visualVariables = null;
        if (endDate) {
            var endDateFieldName = timeUtils_1.getFieldFromDate(endDate);
            visualVariables = [new SizeVariable({
                    valueExpressionTitle: "7-day rolling average of new COVID-19 cases from " + timeUtils_1.formatDate(startDate) + " - " + timeUtils_1.formatDate(endDate),
                    valueExpression: expressionUtils_1.expressionDifference(expressionUtils_1.createNewInfectionsExpression(startDateFieldName, true), expressionUtils_1.createNewInfectionsExpression(endDateFieldName, true), true),
                    stops: [
                        { value: 0, size: 0 },
                        { value: 1, size: "2px" },
                        { value: 100, size: "10px" },
                        { value: 1000, size: "50px" },
                        { value: 5000, size: "200px" }
                    ]
                })];
        }
        else {
            visualVariables = [new SizeVariable({
                    valueExpressionTitle: "7-day rolling average of new COVID-19 cases as of " + timeUtils_1.formatDate(startDate),
                    valueExpression: expressionUtils_1.createNewInfectionsExpression(startDateFieldName),
                    stops: [
                        { value: 0, size: 0 },
                        { value: 1, size: "2px" },
                        { value: 100, size: "10px" },
                        { value: 1000, size: "50px" },
                        { value: 5000, size: "200px" }
                    ]
                })];
        }
        return new SimpleRenderer({
            symbol: createDefaultSymbol(null, new symbols_1.SimpleLineSymbol({
                color: new Color("rgba(222, 18, 222, 0.5)"),
                width: endDate ? 0 : 0.5
            })),
            label: "County",
            visualVariables: visualVariables
        });
    }
    function createActiveCasesRenderer(params) {
        var colors = colorRamps.light[0];
        var startDate = params.startDate, endDate = params.endDate;
        var startDateFieldName = timeUtils_1.getFieldFromDate(startDate);
        var visualVariables = null;
        if (endDate) {
            var colors_2 = colorRamps.light[6];
            var endDateFieldName = timeUtils_1.getFieldFromDate(endDate);
            visualVariables = [
                new SizeVariable({
                    valueExpressionTitle: "Change in active COVID-19 cases from " + timeUtils_1.formatDate(startDate) + " - " + timeUtils_1.formatDate(endDate),
                    valueExpression: expressionUtils_1.expressionDifference(expressionUtils_1.createActiveCasesExpression(startDateFieldName, true), expressionUtils_1.createActiveCasesExpression(endDateFieldName, true), true),
                    stops: [
                        { value: -10000, size: "50px" },
                        { value: -1000, size: "20px" },
                        { value: -10, size: "4px" },
                        { value: 10, size: "4px" },
                        { value: 1000, size: "20px" },
                        { value: 10000, size: "50px" }
                    ]
                }),
                new ColorVariable({
                    valueExpression: expressionUtils_1.expressionPercentChange(expressionUtils_1.createActiveCasesExpression(startDateFieldName, true), expressionUtils_1.createActiveCasesExpression(endDateFieldName, true), true),
                    legendOptions: {
                        title: "Change in active cases from " + timeUtils_1.formatDate(startDate) + " - " + timeUtils_1.formatDate(endDate)
                    },
                    stops: [
                        { value: -100, color: colors_2[0], label: "Decrease" },
                        { value: -50, color: colors_2[1] },
                        { value: 0, color: colors_2[2], label: "No change" },
                        { value: 50, color: colors_2[3] },
                        { value: 100, color: colors_2[4], label: "Increase" }
                    ]
                })
            ];
        }
        else {
            visualVariables = [new SizeVariable({
                    valueExpressionTitle: "Active COVID-19 cases on " + timeUtils_1.formatDate(startDate),
                    valueExpression: expressionUtils_1.createActiveCasesExpression(startDateFieldName),
                    stops: [
                        { value: 0, size: 0 },
                        { value: 1, size: "2px" },
                        { value: 100, size: "4px" },
                        { value: 1000, size: "10px" },
                        { value: 10000, size: "50px" },
                        { value: 100000, size: "200px" }
                    ]
                })];
        }
        return new SimpleRenderer({
            symbol: createDefaultSymbol(null, new symbols_1.SimpleLineSymbol({
                color: endDate ? new Color("rgba(255, 255, 255, 0.3)") : new Color("rgba(222, 18, 222, 1)"),
                width: endDate ? 0.5 : 0.5
            })),
            label: "County",
            visualVariables: visualVariables
        });
    }
    function createDoublingTimeRenderer(params) {
        var colors = colorRamps.light[0];
        var startDate = params.startDate, endDate = params.endDate;
        var startDateFieldName = timeUtils_1.getFieldFromDate(startDate);
        var visualVariables = null;
        if (endDate) {
            var colors_3 = colorRamps.light[4];
            var endDateFieldName = timeUtils_1.getFieldFromDate(endDate);
            visualVariables = [
                new SizeVariable({
                    valueExpression: expressionUtils_1.expressionDifference(expressionUtils_1.createTotalInfectionsExpression(startDateFieldName), expressionUtils_1.createTotalInfectionsExpression(endDateFieldName)),
                    legendOptions: {
                        title: "New COVID-19 cases from " + timeUtils_1.formatDate(startDate) + " - " + timeUtils_1.formatDate(endDate)
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
                    valueExpressionTitle: "Doubling time change from " + timeUtils_1.formatDate(startDate) + " - " + timeUtils_1.formatDate(endDate),
                    valueExpression: expressionUtils_1.expressionDifference(expressionUtils_1.createDoublingTimeExpression(startDateFieldName, true), expressionUtils_1.createDoublingTimeExpression(endDateFieldName, true), true),
                    stops: [
                        { value: -28, color: colors_3[4], label: ">28 days faster (bad)" },
                        { value: -14, color: colors_3[3] },
                        { value: 0, color: colors_3[2], label: "No change" },
                        { value: 14, color: colors_3[1] },
                        { value: 28, color: colors_3[0], label: ">28 days slower (good)" }
                    ]
                })
            ];
        }
        else {
            visualVariables = [
                new SizeVariable({
                    valueExpression: expressionUtils_1.createTotalInfectionsExpression(startDateFieldName),
                    legendOptions: {
                        title: "Total COVID-19 cases as of " + timeUtils_1.formatDate(startDate)
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
                    valueExpression: expressionUtils_1.createDoublingTimeExpression(startDateFieldName),
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
                    valueExpression: expressionUtils_1.createDoublingTimeExpression(startDateFieldName),
                    stops: [
                        { value: 7, opacity: 1 },
                        { value: 14, opacity: 0.6 },
                        { value: 28, opacity: 0.4 }
                    ]
                })
            ];
        }
        return new SimpleRenderer({
            symbol: createDefaultSymbol(new Color("#f7f7f7")),
            label: "County",
            visualVariables: visualVariables
        });
    }
    function createDeathRateRenderer(params) {
        var colors = colorRamps.light[0];
        var startDate = params.startDate, endDate = params.endDate;
        var startDateFieldName = timeUtils_1.getFieldFromDate(startDate);
        var visualVariables = null;
        if (endDate) {
            var endDateFieldName = timeUtils_1.getFieldFromDate(endDate);
            var colors_4 = colorRamps.light[6];
            visualVariables = [
                new SizeVariable({
                    valueExpressionTitle: "Total deaths",
                    valueExpression: expressionUtils_1.expressionDifference(expressionUtils_1.createTotalDeathsExpression(startDateFieldName), expressionUtils_1.createTotalDeathsExpression(endDateFieldName)),
                    legendOptions: {
                        title: "New COVID-19 deaths from " + timeUtils_1.formatDate(startDate) + " - " + timeUtils_1.formatDate(endDate)
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
                    valueExpression: expressionUtils_1.expressionDifference(expressionUtils_1.createDeathRateExpression(startDateFieldName), expressionUtils_1.createDeathRateExpression(endDateFieldName), true),
                    valueExpressionTitle: "Change in death rate by % points",
                    stops: [
                        { value: -5, color: colors_4[0] },
                        { value: -2, color: colors_4[1] },
                        { value: 0, color: colors_4[2] },
                        { value: 2, color: colors_4[3] },
                        { value: 5, color: colors_4[4] }
                    ]
                })
            ];
        }
        else {
            visualVariables = [
                new SizeVariable({
                    valueExpressionTitle: "Total deaths",
                    valueExpression: expressionUtils_1.createTotalDeathsExpression(startDateFieldName),
                    legendOptions: {
                        title: "Total COVID-19 deaths as of " + timeUtils_1.formatDate(startDate)
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
                    valueExpression: expressionUtils_1.createDeathRateExpression(startDateFieldName),
                    stops: [
                        { value: 1, color: colors[0] },
                        { value: 5, color: colors[1] },
                        { value: 7, color: colors[2] },
                        { value: 10, color: colors[3] },
                        { value: 20, color: colors[4] }
                    ]
                })
            ];
        }
        return new SimpleRenderer({
            symbol: createDefaultSymbol(new Color("#f7f7f7")),
            label: "County",
            visualVariables: visualVariables
        });
    }
    function createCaseRateRenderer(params) {
        var colors = colorRamps.light[0];
        var startDate = params.startDate, endDate = params.endDate;
        var startDateFieldName = timeUtils_1.getFieldFromDate(startDate);
        var visualVariables = null;
        if (endDate) {
            var colors_5 = colorRamps.light[2];
            var endDateFieldName = timeUtils_1.getFieldFromDate(endDate);
            visualVariables = [
                new ColorVariable({
                    valueExpression: expressionUtils_1.expressionDifference(expressionUtils_1.createInfectionRateExpression(startDateFieldName), expressionUtils_1.createInfectionRateExpression(endDateFieldName)),
                    valueExpressionTitle: "Change in COVID-19 cases per 100k people",
                    stops: [
                        { value: 0, color: colors_5[0] },
                        { value: 250, color: colors_5[1] },
                        { value: 500, color: colors_5[2] },
                        { value: 750, color: colors_5[3] },
                        { value: 1000, color: colors_5[4] }
                    ]
                })
            ];
        }
        else {
            visualVariables = [
                new ColorVariable({
                    valueExpression: expressionUtils_1.createInfectionRateExpression(startDateFieldName),
                    valueExpressionTitle: "Total COVID-19 cases per 100k people",
                    stops: [
                        { value: 50, color: colors[0] },
                        { value: 500, color: colors[1] },
                        { value: 1000, color: colors[2] },
                        { value: 2000, color: colors[3] },
                        { value: 3000, color: colors[4] }
                    ]
                })
            ];
        }
        return new SimpleRenderer({
            symbol: new symbols_1.SimpleFillSymbol({
                outline: new symbols_1.SimpleLineSymbol({
                    color: "rgba(128,128,128,0.4)",
                    width: 0
                })
            }),
            label: "County",
            visualVariables: visualVariables
        });
    }
    function createActiveRateRenderer(params) {
        var colors = colorRamps.light[0];
        var startDate = params.startDate, endDate = params.endDate;
        var startDateFieldName = timeUtils_1.getFieldFromDate(startDate);
        var visualVariables = null;
        if (endDate) {
            var colors_6 = colorRamps.light[6];
            var endDateFieldName = timeUtils_1.getFieldFromDate(endDate);
            visualVariables = [
                new ColorVariable({
                    valueExpression: expressionUtils_1.expressionDifference(expressionUtils_1.createActiveCasesPer100kExpression(startDateFieldName, true), expressionUtils_1.createActiveCasesPer100kExpression(endDateFieldName, true), true),
                    valueExpressionTitle: "Change in active COVID-19 cases per 100k people",
                    stops: [
                        { value: -1000, color: colors_6[0] },
                        { value: -500, color: colors_6[1] },
                        { value: 0, color: colors_6[2] },
                        { value: 500, color: colors_6[3] },
                        { value: 1000, color: colors_6[4] }
                    ]
                })
            ];
        }
        else {
            visualVariables = [
                new ColorVariable({
                    valueExpression: expressionUtils_1.createActiveCasesPer100kExpression(startDateFieldName),
                    valueExpressionTitle: "Active COVID-19 cases per 100k people",
                    stops: [
                        { value: 50, color: colors[0] },
                        { value: 200, color: colors[1] },
                        { value: 500, color: colors[2] },
                        { value: 1000, color: colors[3] },
                        { value: 1500, color: colors[4] }
                    ]
                })
            ];
        }
        return new SimpleRenderer({
            symbol: new symbols_1.SimpleFillSymbol({
                outline: new symbols_1.SimpleLineSymbol({
                    color: "rgba(128,128,128,0.4)",
                    width: 0
                }),
            }),
            label: "County",
            visualVariables: visualVariables
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