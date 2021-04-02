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
define(["require", "exports", "esri/intl", "esri/TimeExtent", "esri/core/lang", "./layerUtils"], function (require, exports, intl, TimeExtent, lang, layerUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.endDate = getPreviousDay(new Date());
    exports.initialTimeExtent = {
        start: new Date(2020, 0, 22),
        end: exports.endDate
    };
    function getFieldFromDate(d) {
        var fieldName = "" + layerUtils_1.prefix + ("0" + (d.getMonth() + 1)).slice(-2) + layerUtils_1.separator + ("0" + d.getDate()).slice(-2) + layerUtils_1.separator + (d.getFullYear()).toString();
        return fieldName;
    }
    exports.getFieldFromDate = getFieldFromDate;
    function getPreviousDay(d) {
        return new Date(lang.clone(d).setDate(d.getDate() - 1));
    }
    exports.getPreviousDay = getPreviousDay;
    function getNextDay(d) {
        return new Date(lang.clone(d).setDate(d.getDate() + 1));
    }
    exports.getNextDay = getNextDay;
    function dateAdd(d, days) {
        return new Date(lang.clone(d).setDate(d.getDate() + days));
    }
    exports.dateAdd = dateAdd;
    function formatDate(d) {
        return intl.formatDate(d, intl.convertDateFormatToIntlOptions("short-date"));
    }
    exports.formatDate = formatDate;
    exports.timeExtents = {
        beforeCA: new TimeExtent({
            start: exports.initialTimeExtent.start,
            end: new Date(2020, 2, 20)
        }),
        afterCA: new TimeExtent({
            start: new Date(2020, 2, 20),
            end: exports.initialTimeExtent.end
        }),
        memorial: new TimeExtent({
            start: new Date(2020, 4, 25),
            end: exports.initialTimeExtent.end
        }),
        july4: new TimeExtent({
            start: new Date(2020, 6, 4),
            end: exports.initialTimeExtent.end
        }),
        sturgis: new TimeExtent({
            start: new Date(2020, 7, 7),
            end: exports.initialTimeExtent.end
        }),
        labor: new TimeExtent({
            start: new Date(2020, 8, 7),
            end: exports.initialTimeExtent.end
        }),
        thanksgiving: new TimeExtent({
            start: new Date(2020, 10, 26),
            end: exports.initialTimeExtent.end
        }),
        christmas: new TimeExtent({
            start: new Date(2020, 11, 25),
            end: exports.initialTimeExtent.end
        }),
        newyears: new TimeExtent({
            start: new Date(2021, 0, 1),
            end: exports.initialTimeExtent.end
        }),
        month: new TimeExtent({
            start: dateAdd(exports.initialTimeExtent.end, -30),
            end: exports.initialTimeExtent.end
        }),
        twoWeeks: new TimeExtent({
            start: dateAdd(exports.initialTimeExtent.end, -14),
            end: exports.initialTimeExtent.end
        }),
    };
    function setEndDate(d) {
        return __awaiter(this, void 0, void 0, function () {
            var latestDate, query, features, feature, latestDateFieldName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        latestDate = d;
                        if (!!d) return [3 /*break*/, 2];
                        query = layerUtils_1.infectionsPopulationLayer.createQuery();
                        // query.where = "FIPS = '06037'";
                        query.objectIds = [1];
                        query.returnGeometry = false;
                        return [4 /*yield*/, layerUtils_1.infectionsPopulationLayer.queryFeatures(query)];
                    case 1:
                        features = (_a.sent()).features;
                        feature = features[0];
                        latestDate = new Date();
                        latestDateFieldName = getFieldFromDate(latestDate);
                        while (!feature.attributes[latestDateFieldName]) {
                            latestDate = getPreviousDay(latestDate);
                            latestDateFieldName = getFieldFromDate(latestDate);
                        }
                        _a.label = 2;
                    case 2:
                        exports.endDate = latestDate;
                        exports.initialTimeExtent.end = exports.endDate;
                        exports.timeExtents.afterCA.end = exports.endDate;
                        exports.timeExtents.beforeCA.end = exports.endDate;
                        exports.timeExtents.july4.end = exports.endDate;
                        exports.timeExtents.labor.end = exports.endDate;
                        exports.timeExtents.memorial.end = exports.endDate;
                        exports.timeExtents.month.start = dateAdd(exports.initialTimeExtent.end, -30);
                        exports.timeExtents.month.end = exports.endDate;
                        exports.timeExtents.sturgis.end = exports.endDate;
                        exports.timeExtents.twoWeeks.start = dateAdd(exports.initialTimeExtent.end, -14);
                        exports.timeExtents.twoWeeks.end = exports.endDate;
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.setEndDate = setEndDate;
});
//# sourceMappingURL=timeUtils.js.map