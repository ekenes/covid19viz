define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.endDate = getPreviousDay(new Date());
    exports.initialTimeExtent = {
        start: new Date(2020, 0, 22),
        end: exports.endDate
    };
    function getFieldFromDate(d) {
        var fieldName = (d.getMonth() + 1) + "/" + d.getDate() + "/" + (d.getFullYear()).toString().slice(-2);
        return fieldName;
    }
    exports.getFieldFromDate = getFieldFromDate;
    function getPreviousDay(d) {
        return new Date(d.setDate(d.getDate() - 1));
    }
    function getNextDay(d) {
        return new Date(d.setDate(d.getDate() + 1));
    }
});
//# sourceMappingURL=timeOptions.js.map