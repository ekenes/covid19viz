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
        month: new TimeExtent({
            start: dateAdd(exports.initialTimeExtent.end, -30),
            end: exports.initialTimeExtent.end
        }),
        twoWeeks: new TimeExtent({
            start: dateAdd(exports.initialTimeExtent.end, -14),
            end: exports.initialTimeExtent.end
        }),
    };
});
//# sourceMappingURL=timeUtils.js.map