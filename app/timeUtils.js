define(["require", "exports", "esri/intl", "./layerUtils"], function (require, exports, intl, layerUtils_1) {
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
        return new Date(d.setDate(d.getDate() - 1));
    }
    exports.getPreviousDay = getPreviousDay;
    function getNextDay(d) {
        return new Date(d.setDate(d.getDate() + 1));
    }
    exports.getNextDay = getNextDay;
    function formatDate(d) {
        return intl.formatDate(d, intl.convertDateFormatToIntlOptions("short-date"));
    }
    exports.formatDate = formatDate;
});
//# sourceMappingURL=timeUtils.js.map