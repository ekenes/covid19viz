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
define(["require", "exports", "./timeUtils"], function (require, exports, timeUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var allFeatures = null;
    var allStats = {};
    function getTotalCases(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, startDate, endDate, startDateFieldName, totalCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layer = params.layer, startDate = params.startDate, endDate = params.endDate;
                        startDateFieldName = timeUtils_1.getFieldFromDate(startDate);
                        if (!!allFeatures) return [3 /*break*/, 2];
                        return [4 /*yield*/, queryAllFeatures(layer)];
                    case 1:
                        allFeatures = _a.sent();
                        _a.label = 2;
                    case 2:
                        totalCount = allFeatures.map(function (feature) {
                            var value = feature.attributes[startDateFieldName];
                            var cases = parseInt(value.split("|")[0]);
                            return cases;
                        })
                            .reduce(function (prev, curr) { return prev + curr; });
                        console.log("total", totalCount);
                        return [2 /*return*/, totalCount];
                }
            });
        });
    }
    exports.getTotalCases = getTotalCases;
    function getTotalDeaths(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, startDate, endDate, startDateFieldName, totalCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layer = params.layer, startDate = params.startDate, endDate = params.endDate;
                        startDateFieldName = timeUtils_1.getFieldFromDate(startDate);
                        if (!!allFeatures) return [3 /*break*/, 2];
                        return [4 /*yield*/, queryAllFeatures(layer)];
                    case 1:
                        allFeatures = _a.sent();
                        _a.label = 2;
                    case 2:
                        totalCount = allFeatures.map(function (feature) {
                            var value = feature.attributes[startDateFieldName];
                            var cases = parseInt(value.split("|")[1]);
                            return cases;
                        })
                            .reduce(function (prev, curr) { return prev + curr; });
                        return [2 /*return*/, totalCount];
                }
            });
        });
    }
    exports.getTotalDeaths = getTotalDeaths;
    function queryAllFeatures(layer) {
        return __awaiter(this, void 0, void 0, function () {
            var features;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, layer.queryFeatures({
                            returnGeometry: false,
                            outFields: ["*"],
                            maxRecordCountFactor: 5,
                            where: "1=1"
                        })];
                    case 1:
                        features = (_a.sent()).features;
                        return [2 /*return*/, features];
                }
            });
        });
    }
    function getStatsForDate(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, startDate, endDate, totalCases, totalDeaths, totalRecovered, totalActive, totalPopulation, startDateFieldName, daysAgo14, daysAgo15, daysAgo25, daysAgo26, daysAgo49, stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layer = params.layer, startDate = params.startDate, endDate = params.endDate;
                        totalCases = 0;
                        totalDeaths = 0;
                        totalRecovered = 0;
                        totalActive = 0;
                        totalPopulation = 0;
                        startDateFieldName = timeUtils_1.getFieldFromDate(startDate);
                        if (allStats[startDateFieldName]) {
                            return [2 /*return*/, allStats[startDateFieldName]];
                        }
                        daysAgo14 = timeUtils_1.dateAdd(startDate, -14);
                        daysAgo15 = timeUtils_1.dateAdd(startDate, -15);
                        daysAgo25 = timeUtils_1.dateAdd(startDate, -25);
                        daysAgo26 = timeUtils_1.dateAdd(startDate, -26);
                        daysAgo49 = timeUtils_1.dateAdd(startDate, -49);
                        if (!!allFeatures) return [3 /*break*/, 2];
                        return [4 /*yield*/, queryAllFeatures(layer)];
                    case 1:
                        allFeatures = _a.sent();
                        _a.label = 2;
                    case 2:
                        allFeatures.forEach(function (feature) {
                            var value = feature.attributes[startDateFieldName];
                            if (!value) {
                                return;
                            }
                            var currentDayInfections = parseInt(value.split("|")[0]);
                            var currentDayDeaths = parseInt(value.split("|")[1]);
                            var startDate = new Date(2020, 0, 22);
                            var deathCount = currentDayDeaths;
                            var activeEstimate = 0;
                            if (daysAgo15 < startDate) {
                                activeEstimate = currentDayInfections - deathCount;
                            }
                            else {
                                var daysAgo14FieldName = timeUtils_1.getFieldFromDate(daysAgo14);
                                var daysAgo14Value = feature.attributes[daysAgo14FieldName] || "0|0";
                                var daysAgo14Infections = parseInt(daysAgo14Value.split("|")[0]);
                                var daysAgo15FieldName = timeUtils_1.getFieldFromDate(daysAgo15);
                                var daysAgo15Value = feature.attributes[daysAgo15FieldName] || "0|0";
                                var daysAgo15Infections = parseInt(daysAgo15Value.split("|")[0]);
                                if (daysAgo26 < startDate) {
                                    activeEstimate = Math.round((currentDayInfections - daysAgo14Infections) + (0.19 * daysAgo15Infections) - deathCount);
                                }
                                else {
                                    var daysAgo25FieldName = timeUtils_1.getFieldFromDate(daysAgo25);
                                    var daysAgo25Value = feature.attributes[daysAgo25FieldName] || "0|0";
                                    var daysAgo25Infections = parseInt(daysAgo25Value.split("|")[0]);
                                    var daysAgo26FieldName = timeUtils_1.getFieldFromDate(daysAgo26);
                                    var daysAgo26Value = feature.attributes[daysAgo26FieldName] || "0|0";
                                    var daysAgo26Infections = parseInt(daysAgo26Value.split("|")[0]);
                                    if (daysAgo49 < startDate) {
                                        activeEstimate = Math.round((currentDayInfections - daysAgo14Infections) + (0.19 * (daysAgo15Infections - daysAgo25Infections)) + (0.05 * daysAgo26Infections) - deathCount);
                                    }
                                    else {
                                        var daysAgo49FieldName = timeUtils_1.getFieldFromDate(daysAgo49);
                                        var daysAgo49Value = feature.attributes[daysAgo49FieldName] || "0|0";
                                        var daysAgo49Infections = parseInt(daysAgo49Value.split("|")[0]);
                                        var daysAgo49Deaths = parseInt(daysAgo49Value.split("|")[1]);
                                        deathCount = currentDayDeaths - daysAgo49Deaths;
                                        // Active Cases = (100% of new cases from last 14 days + 19% of days 15-25 + 5% of days 26-49) - Death Count
                                        activeEstimate = Math.round((currentDayInfections - daysAgo14Infections) + (0.19 * (daysAgo15Infections - daysAgo25Infections)) + (0.05 * (daysAgo26Infections - daysAgo49Infections)) - deathCount);
                                    }
                                }
                            }
                            var recoveredEstimate = Math.round(currentDayInfections - activeEstimate - currentDayDeaths);
                            totalCases += currentDayInfections;
                            totalDeaths += currentDayDeaths;
                            totalActive += activeEstimate;
                            totalRecovered += recoveredEstimate;
                            totalPopulation += feature.attributes.POPULATION;
                        });
                        stats = {
                            cases: totalCases,
                            deaths: totalDeaths,
                            active: totalActive,
                            recovered: totalRecovered,
                            activeRate: (totalActive / totalPopulation) * 100000,
                            recoveredRate: (totalRecovered / totalPopulation) * 100000,
                            deathRate: (totalDeaths / totalPopulation) * 100000,
                        };
                        allStats[startDateFieldName] = stats;
                        return [2 /*return*/, stats];
                }
            });
        });
    }
    exports.getStatsForDate = getStatsForDate;
    function getStats(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, startDate, endDate, startStats, endStats, diffStats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layer = params.layer, startDate = params.startDate, endDate = params.endDate;
                        return [4 /*yield*/, getStatsForDate({
                                layer: layer,
                                startDate: startDate
                            })];
                    case 1:
                        startStats = _a.sent();
                        if (!endDate) return [3 /*break*/, 3];
                        return [4 /*yield*/, getStatsForDate({
                                layer: layer,
                                startDate: endDate
                            })];
                    case 2:
                        endStats = _a.sent();
                        diffStats = {
                            cases: endStats.cases - startStats.cases,
                            deaths: endStats.deaths - startStats.deaths,
                            active: endStats.active - startStats.active,
                            recovered: endStats.recovered - startStats.recovered,
                            activeRate: endStats.activeRate - startStats.activeRate,
                            recoveredRate: endStats.recoveredRate - startStats.recoveredRate,
                            deathRate: endStats.deathRate - startStats.deathRate,
                        };
                        return [2 /*return*/, diffStats];
                    case 3: return [2 /*return*/, startStats];
                }
            });
        });
    }
    exports.getStats = getStats;
});
//# sourceMappingURL=statistics.js.map