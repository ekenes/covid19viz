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
define(["require", "exports", "esri/tasks/support/StatisticDefinition", "./timeUtils"], function (require, exports, StatisticDefinition, timeUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var allStats = {};
    function getStatsForDate(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layerView, startDate, endDate, initialDate, query, startDateFieldName, totalCasesDefinition, totalDeathsDefinition, totalPopulationDefinition, totalActiveDefinition, daysAgo14, daysAgo15, daysAgo25, daysAgo26, daysAgo49, daysAgo14Infections, daysAgo15Infections, daysAgo25Infections, daysAgo26Infections, daysAgo49Infections, daysAgo49Deaths, deathCount, features, _a, cases, deaths, active, population, recovered, stats;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        layerView = params.layerView, startDate = params.startDate, endDate = params.endDate;
                        initialDate = timeUtils_1.initialTimeExtent.start;
                        query = layerView.createQuery();
                        startDateFieldName = timeUtils_1.getFieldFromDate(startDate);
                        if (allStats[startDateFieldName]) {
                            return [2 /*return*/, allStats[startDateFieldName]];
                        }
                        totalCasesDefinition = new StatisticDefinition({
                            onStatisticField: "Confirmed_" + startDateFieldName,
                            outStatisticFieldName: "cases",
                            statisticType: "sum"
                        });
                        totalDeathsDefinition = new StatisticDefinition({
                            onStatisticField: "Deaths_" + startDateFieldName,
                            outStatisticFieldName: "deaths",
                            statisticType: "sum"
                        });
                        totalPopulationDefinition = new StatisticDefinition({
                            onStatisticField: "POP2018",
                            outStatisticFieldName: "population",
                            statisticType: "sum"
                        });
                        totalActiveDefinition = new StatisticDefinition({
                            outStatisticFieldName: "active",
                            statisticType: "sum"
                        });
                        daysAgo14 = timeUtils_1.dateAdd(startDate, -14);
                        daysAgo15 = timeUtils_1.dateAdd(startDate, -15);
                        daysAgo25 = timeUtils_1.dateAdd(startDate, -25);
                        daysAgo26 = timeUtils_1.dateAdd(startDate, -26);
                        daysAgo49 = timeUtils_1.dateAdd(startDate, -49);
                        if (daysAgo15 < initialDate) {
                            totalActiveDefinition.onStatisticField = "Confirmed_" + startDateFieldName + " - Deaths_" + startDateFieldName;
                        }
                        else {
                            daysAgo14Infections = "Confirmed_" + timeUtils_1.getFieldFromDate(daysAgo14);
                            daysAgo15Infections = "Confirmed_" + timeUtils_1.getFieldFromDate(daysAgo15);
                            if (daysAgo26 < initialDate) {
                                totalActiveDefinition.onStatisticField = "(Confirmed_" + startDateFieldName + " - " + daysAgo14Infections + ") + ( 0.19 * " + daysAgo15Infections + ") - Deaths_" + startDateFieldName;
                            }
                            else {
                                daysAgo25Infections = "Confirmed_" + timeUtils_1.getFieldFromDate(daysAgo25);
                                daysAgo26Infections = "Confirmed_" + timeUtils_1.getFieldFromDate(daysAgo26);
                                if (daysAgo49 < initialDate) {
                                    totalActiveDefinition.onStatisticField = "(Confirmed_" + startDateFieldName + " - " + daysAgo14Infections + ") + ( 0.19 * (" + daysAgo15Infections + " - " + daysAgo25Infections + ")) + ( 0.05 * " + daysAgo26Infections + " ) - Deaths_" + startDateFieldName;
                                }
                                else {
                                    daysAgo49Infections = "Confirmed_" + timeUtils_1.getFieldFromDate(daysAgo49);
                                    daysAgo49Deaths = "Deaths_" + timeUtils_1.getFieldFromDate(daysAgo49);
                                    deathCount = "(Deaths_" + startDateFieldName + " - " + daysAgo49Deaths + ")";
                                    // Active Cases = (100% of new cases from last 14 days + 19% of days 15-25 + 5% of days 26-49) - Death Count
                                    totalActiveDefinition.onStatisticField = "(Confirmed_" + startDateFieldName + " - " + daysAgo14Infections + ") + ( 0.19 * (" + daysAgo15Infections + " - " + daysAgo25Infections + ")) + ( 0.05 * (" + daysAgo26Infections + " - " + daysAgo49Infections + ")) - " + deathCount;
                                }
                            }
                        }
                        query.outFields = ["*"];
                        query.returnGeometry = false;
                        query.where = "1=1";
                        query.outStatistics = [
                            totalCasesDefinition,
                            totalDeathsDefinition,
                            totalPopulationDefinition,
                            totalActiveDefinition
                        ];
                        return [4 /*yield*/, layerView.queryFeatures(query)];
                    case 1:
                        features = (_b.sent()).features;
                        _a = features[0].attributes, cases = _a.cases, deaths = _a.deaths, active = _a.active, population = _a.population;
                        recovered = cases - active - deaths;
                        stats = {
                            cases: cases,
                            deaths: deaths,
                            active: active,
                            recovered: recovered,
                            activeRate: (active / population) * 100000,
                            recoveredRate: (recovered / population) * 100000,
                            deathRate: (deaths / population) * 100000,
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
            var layerView, startDate, endDate, startStats, endStats, diffStats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layerView = params.layerView, startDate = params.startDate, endDate = params.endDate;
                        return [4 /*yield*/, getStatsForDate({
                                layerView: layerView,
                                startDate: startDate
                            })];
                    case 1:
                        startStats = _a.sent();
                        if (!endDate) return [3 /*break*/, 3];
                        return [4 /*yield*/, getStatsForDate({
                                layerView: layerView,
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