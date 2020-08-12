define(["require", "exports", "./timeUtils", "esri/PopupTemplate", "esri/popup/content/TextContent", "esri/popup/content/MediaContent", "esri/popup/FieldInfo", "esri/popup/ExpressionInfo", "./expressionUtils", "esri/popup/content"], function (require, exports, timeUtils_1, PopupTemplate, TextContent, MediaContent, FieldInfo, ExpressionInfo, expressionUtils_1, content_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function updatePopupTemplate(params) {
        var currentDate = params.currentDate, rendererType = params.rendererType, existingTemplate = params.existingTemplate, layer = params.layer;
        var popupTemplate;
        popupTemplate = createComprehensivePopupTemplate({
            currentDate: currentDate,
            existingTemplate: existingTemplate,
            rendererType: rendererType
        });
        layer.popupTemplate = popupTemplate;
    }
    exports.updatePopupTemplate = updatePopupTemplate;
    function createTotalCasesExpressionInfos(startDate, endDate) {
        var expressionInfos = [];
        var currentDate = startDate;
        while (currentDate <= endDate) {
            var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
            expressionInfos.push(new ExpressionInfo({
                expression: expressionUtils_1.createTotalCasesExpression(currentFieldName),
                name: "total-infections-" + currentFieldName,
                title: timeUtils_1.formatDate(currentDate)
            }));
            currentDate = timeUtils_1.getNextDay(currentDate);
        }
        return expressionInfos;
    }
    function createTotalDeathsExpressionInfos(startDate, endDate) {
        var expressionInfos = [];
        var currentDate = startDate;
        while (currentDate <= endDate) {
            var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
            expressionInfos.push(new ExpressionInfo({
                expression: expressionUtils_1.createTotalDeathsExpression(currentFieldName),
                name: "total-deaths-" + currentFieldName,
                title: timeUtils_1.formatDate(currentDate)
            }));
            currentDate = timeUtils_1.getNextDay(currentDate);
        }
        return expressionInfos;
    }
    function createTotalActiveCasesExpressionInfos(startDate, endDate) {
        var expressionInfos = [];
        var currentDate = startDate;
        while (currentDate <= endDate) {
            var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
            expressionInfos.push(new ExpressionInfo({
                expression: expressionUtils_1.createActiveCasesExpression(currentFieldName),
                name: "total-active-" + currentFieldName,
                title: timeUtils_1.formatDate(currentDate)
            }));
            currentDate = timeUtils_1.getNextDay(currentDate);
        }
        return expressionInfos;
    }
    function createTotalRecoveredCasesExpressionInfos(startDate, endDate) {
        var expressionInfos = [];
        var currentDate = startDate;
        while (currentDate <= endDate) {
            var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
            expressionInfos.push(new ExpressionInfo({
                expression: expressionUtils_1.createRecoveredCasesExpression(currentFieldName),
                name: "total-recovered-" + currentFieldName,
                title: timeUtils_1.formatDate(currentDate)
            }));
            currentDate = timeUtils_1.getNextDay(currentDate);
        }
        return expressionInfos;
    }
    function createNewCasesExpressionInfos(startDate, endDate) {
        var expressionInfos = [];
        var currentDate = startDate;
        while (currentDate <= endDate) {
            var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
            expressionInfos.push(new ExpressionInfo({
                expression: expressionUtils_1.createNewCasesAverageExpression(currentFieldName),
                name: "new-cases-" + currentFieldName,
                title: timeUtils_1.formatDate(currentDate)
            }));
            currentDate = timeUtils_1.getNextDay(currentDate);
        }
        return expressionInfos;
    }
    function createDoublingTimeExpressionInfos(startDate, endDate) {
        var expressionInfos = [];
        var currentDate = startDate;
        while (currentDate <= endDate) {
            var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
            expressionInfos.push(new ExpressionInfo({
                expression: expressionUtils_1.createDoublingTimeExpression(currentFieldName),
                name: "doubling-time-" + currentFieldName,
                title: timeUtils_1.formatDate(currentDate)
            }));
            currentDate = timeUtils_1.getNextDay(currentDate);
        }
        return expressionInfos;
    }
    function createComprehensivePopupTemplate(params) {
        var currentDate = params.currentDate, existingTemplate = params.existingTemplate, rendererType = params.rendererType;
        var currentFieldName = timeUtils_1.getFieldFromDate(currentDate);
        var firstMediaInfoTitle;
        switch (rendererType) {
            case "total-infections":
                firstMediaInfoTitle = "Total cases";
                break;
            case "total-deaths":
                firstMediaInfoTitle = "Deaths";
                break;
            case "total-active":
                firstMediaInfoTitle = "Active cases";
                break;
            case "doubling-time":
                firstMediaInfoTitle = "Doubling Time (days)";
                break;
            case "death-rate":
                firstMediaInfoTitle = "Deaths";
                break;
            case "death-rate-per-100k":
                firstMediaInfoTitle = "Deaths";
                break;
            case "active-rate":
                firstMediaInfoTitle = "Active cases";
                break;
            case "infection-rate-per-100k":
                firstMediaInfoTitle = "Total cases";
                break;
            case "new-total":
                firstMediaInfoTitle = "7-day rolling average of new cases per day";
            case "dot-density":
                firstMediaInfoTitle = "Active cases";
            default:
                break;
        }
        if (existingTemplate) {
            existingTemplate.content[0] = new TextContent({
                text: "An estimated <span style=\"color:#e60049;\"><b>{expression/active}</b></span> out of {POPULATION} people were actively sick with COVID-19 on " + timeUtils_1.formatDate(currentDate) + " here.\n        That equates to about <b>{expression/active-rate}</b> cases for every 100,000 people.\n        Of those that are sick, <b>{expression/new-infections}</b> people tested positive for COVID-19 in the last 7 days."
            });
            existingTemplate.content[1] = new content_1.FieldsContent({
                fieldInfos: [
                    new FieldInfo({
                        fieldName: "expression/total",
                        format: {
                            places: 0,
                            digitSeparator: true
                        }
                    }),
                    new FieldInfo({
                        fieldName: "expression/active",
                        format: {
                            places: 0,
                            digitSeparator: true
                        }
                    }),
                    new FieldInfo({
                        fieldName: "expression/recovered",
                        format: {
                            places: 0,
                            digitSeparator: true
                        }
                    }),
                    new FieldInfo({
                        fieldName: "expression/deaths",
                        format: {
                            places: 0,
                            digitSeparator: true
                        }
                    }),
                    new FieldInfo({
                        fieldName: "expression/death-rate",
                        format: {
                            places: 0,
                            digitSeparator: true
                        }
                    }),
                    new FieldInfo({
                        fieldName: "expression/doubling-time",
                        format: {
                            places: 0,
                            digitSeparator: true
                        }
                    }),
                    new FieldInfo({
                        fieldName: "expression/death-rate-100k",
                        format: {
                            places: 0,
                            digitSeparator: true
                        }
                    })
                ]
            });
            var expressionInfosLength = existingTemplate.expressionInfos.length;
            var replacementIndex = expressionInfosLength - 9;
            existingTemplate.expressionInfos.splice(replacementIndex, 9, new ExpressionInfo({
                expression: expressionUtils_1.createActiveCasesExpression(currentFieldName),
                name: "active",
                title: "Active cases (est.)"
            }), new ExpressionInfo({
                expression: expressionUtils_1.createRecoveredCasesExpression(currentFieldName),
                name: "recovered",
                title: "Recovered (est.)"
            }), new ExpressionInfo({
                expression: expressionUtils_1.createTotalDeathsExpression(currentFieldName),
                name: "deaths",
                title: "Deaths"
            }), new ExpressionInfo({
                expression: expressionUtils_1.createActiveCasesPer100kExpression(currentFieldName),
                name: "active-rate",
                title: "Active rate"
            }), new ExpressionInfo({
                expression: expressionUtils_1.createTotalCasesExpression(currentFieldName),
                name: "total",
                title: "Total cases"
            }), new ExpressionInfo({
                expression: expressionUtils_1.createDoublingTimeExpression(currentFieldName),
                name: "doubling-time",
                title: "Doubling time (days)"
            }), new ExpressionInfo({
                expression: expressionUtils_1.createNewCasesExpression(currentFieldName),
                name: "new-infections",
                title: "New cases"
            }), new ExpressionInfo({
                expression: expressionUtils_1.createDeathRateExpression(currentFieldName),
                name: "death-rate",
                title: "Death rate (% of cases)"
            }), new ExpressionInfo({
                expression: expressionUtils_1.createDeathRate100kExpression(currentFieldName),
                name: "death-rate-100k",
                title: "Deaths per 100,000"
            }));
            var mediaInfos_1 = existingTemplate.content[2].mediaInfos;
            var firstMediaInfo_1 = mediaInfos_1.filter(function (info) { return info.title === firstMediaInfoTitle; })[0];
            moveElementToFront(firstMediaInfo_1, mediaInfos_1);
            return existingTemplate.clone();
        }
        var totalExpressionInfos = createTotalCasesExpressionInfos(timeUtils_1.initialTimeExtent.start, timeUtils_1.initialTimeExtent.end);
        var totalExpressionNameList = totalExpressionInfos.map(function (expressionInfo) { return "expression/" + expressionInfo.name; });
        var totalExpressionFieldInfos = totalExpressionNameList.map(function (name) {
            return {
                fieldName: name,
                format: {
                    places: 0,
                    digitSeparator: true
                }
            };
        });
        var activeExpressionInfos = createTotalActiveCasesExpressionInfos(timeUtils_1.initialTimeExtent.start, timeUtils_1.initialTimeExtent.end);
        var activeExpressionNameList = activeExpressionInfos.map(function (expressionInfo) { return "expression/" + expressionInfo.name; });
        var activeExpressionFieldInfos = activeExpressionNameList.map(function (name) {
            return {
                fieldName: name,
                format: {
                    places: 0,
                    digitSeparator: true
                }
            };
        });
        var deathsExpressionInfos = createTotalDeathsExpressionInfos(timeUtils_1.initialTimeExtent.start, timeUtils_1.initialTimeExtent.end);
        var deathsExpressionNameList = deathsExpressionInfos.map(function (expressionInfo) { return "expression/" + expressionInfo.name; });
        var deathsExpressionFieldInfos = deathsExpressionNameList.map(function (name) {
            return {
                fieldName: name,
                format: {
                    places: 0,
                    digitSeparator: true
                }
            };
        });
        var recoveredExpressionInfos = createTotalRecoveredCasesExpressionInfos(timeUtils_1.initialTimeExtent.start, timeUtils_1.initialTimeExtent.end);
        var recoveredExpressionNameList = recoveredExpressionInfos.map(function (expressionInfo) { return "expression/" + expressionInfo.name; });
        var recoveredExpressionFieldInfos = recoveredExpressionNameList.map(function (name) {
            return {
                fieldName: name,
                format: {
                    places: 0,
                    digitSeparator: true
                }
            };
        });
        var newCasesExpressionInfos = createNewCasesExpressionInfos(timeUtils_1.initialTimeExtent.start, timeUtils_1.initialTimeExtent.end);
        var newCasesExpressionNameList = newCasesExpressionInfos.map(function (expressionInfo) { return "expression/" + expressionInfo.name; });
        var newCasesExpressionFieldInfos = newCasesExpressionNameList.map(function (name) {
            return {
                fieldName: name,
                format: {
                    places: 0,
                    digitSeparator: true
                }
            };
        });
        var doublingTimeExpressionInfos = createDoublingTimeExpressionInfos(timeUtils_1.initialTimeExtent.start, timeUtils_1.initialTimeExtent.end);
        var doublingTimeExpressionNameList = doublingTimeExpressionInfos.map(function (expressionInfo) { return "expression/" + expressionInfo.name; });
        var doublingTimeExpressionFieldInfos = doublingTimeExpressionNameList.map(function (name) {
            return {
                fieldName: name,
                format: {
                    places: 0,
                    digitSeparator: true
                }
            };
        });
        var mediaInfos = [{
                type: "line-chart",
                title: "Total cases",
                value: {
                    fields: totalExpressionNameList
                }
            }, {
                type: "line-chart",
                title: "Active cases",
                value: {
                    fields: activeExpressionNameList
                }
            }, {
                type: "line-chart",
                title: "Recovered cases",
                value: {
                    fields: recoveredExpressionNameList
                }
            }, {
                type: "line-chart",
                title: "Deaths",
                value: {
                    fields: deathsExpressionNameList
                }
            }, {
                type: "column-chart",
                title: "7-day rolling average of new cases per day",
                value: {
                    fields: newCasesExpressionNameList
                }
            }, {
                type: "line-chart",
                title: "Doubling Time (days)",
                value: {
                    fields: doublingTimeExpressionNameList
                }
            }];
        var firstMediaInfo = mediaInfos.filter(function (info) { return info.title === firstMediaInfoTitle; })[0];
        moveElementToFront(firstMediaInfo, mediaInfos);
        return new PopupTemplate({
            title: "{Admin2}, {Province_State}, {Country_Region}",
            outFields: ["*"],
            content: [
                new TextContent({
                    text: "An estimated <span style=\"color:#e60049;\"><b>{expression/active}</b></span> out of {POPULATION} people were actively sick with COVID-19 on " + timeUtils_1.formatDate(currentDate) + " here.\n        That equates to about <b>{expression/active-rate}</b> cases for every 100,000 people.\n        Of those that are sick, <b>{expression/new-infections}</b> people tested positive for COVID-19 in the last 7 days."
                }),
                new content_1.FieldsContent({
                    fieldInfos: [
                        new FieldInfo({
                            fieldName: "expression/total",
                            format: {
                                places: 0,
                                digitSeparator: true
                            }
                        }),
                        new FieldInfo({
                            fieldName: "expression/active",
                            format: {
                                places: 0,
                                digitSeparator: true
                            }
                        }),
                        new FieldInfo({
                            fieldName: "expression/recovered",
                            format: {
                                places: 0,
                                digitSeparator: true
                            }
                        }),
                        new FieldInfo({
                            fieldName: "expression/deaths",
                            format: {
                                places: 0,
                                digitSeparator: true
                            }
                        }),
                        new FieldInfo({
                            fieldName: "expression/death-rate",
                            format: {
                                places: 0,
                                digitSeparator: true
                            }
                        }),
                        new FieldInfo({
                            fieldName: "expression/death-rate-100k",
                            format: {
                                places: 0,
                                digitSeparator: true
                            }
                        }),
                        new FieldInfo({
                            fieldName: "expression/doubling-time",
                            format: {
                                places: 0,
                                digitSeparator: true
                            }
                        })
                    ]
                }),
                new MediaContent({
                    mediaInfos: mediaInfos
                })
            ],
            fieldInfos: activeExpressionFieldInfos
                .concat(recoveredExpressionFieldInfos)
                .concat(deathsExpressionFieldInfos)
                .concat(newCasesExpressionFieldInfos)
                .concat(doublingTimeExpressionFieldInfos)
                .concat(totalExpressionFieldInfos)
                .concat([
                new FieldInfo({
                    fieldName: "POPULATION",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/active",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/recovered",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/deaths",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/death-rate-100k",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/active-rate",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }),
                new FieldInfo({
                    fieldName: "expression/new-infections",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                })
            ]),
            expressionInfos: activeExpressionInfos
                .concat(recoveredExpressionInfos)
                .concat(deathsExpressionInfos)
                .concat(newCasesExpressionInfos)
                .concat(doublingTimeExpressionInfos)
                .concat(totalExpressionInfos)
                .concat([new ExpressionInfo({
                    expression: expressionUtils_1.createActiveCasesExpression(currentFieldName),
                    name: "active",
                    title: "Active cases (est.)"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createRecoveredCasesExpression(currentFieldName),
                    name: "recovered",
                    title: "Recovered (est.)"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createTotalDeathsExpression(currentFieldName),
                    name: "deaths",
                    title: "Deaths"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createActiveCasesPer100kExpression(currentFieldName),
                    name: "active-rate",
                    title: "Active rate"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createTotalCasesExpression(currentFieldName),
                    name: "total",
                    title: "Total cases"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createDoublingTimeExpression(currentFieldName),
                    name: "doubling-time",
                    title: "Doubling time (days)"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createNewCasesExpression(currentFieldName),
                    name: "new-infections",
                    title: "New cases"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createDeathRateExpression(currentFieldName),
                    name: "death-rate",
                    title: "Death rate (% of cases)"
                }), new ExpressionInfo({
                    expression: expressionUtils_1.createDeathRate100kExpression(currentFieldName),
                    name: "death-rate-100k",
                    title: "Deaths per 100,000"
                })])
        });
    }
    function moveElementToFront(element, array) {
        var position = array.indexOf(element);
        if (position === -1) {
            console.error("Element ", element, " is not contained in ", array);
            return;
        }
        array.splice(position, 1);
        array.unshift(element);
    }
});
//# sourceMappingURL=popupTemplateUtils.js.map