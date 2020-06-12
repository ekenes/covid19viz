define(["require", "exports", "esri/layers/FeatureLayer", "esri/renderers", "esri/symbols"], function (require, exports, FeatureLayer, renderers_1, symbols_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Data from Johns Hopkins University
    // "https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series";
    var polygonFillPortalItemId = "45389b90ed234ab4be65820e081254c4";
    var polygonFillLayerId = 2; // polygons
    exports.separator = "_";
    exports.prefix = "DAYSTRING_";
    exports.infectionsPopulationLayer = new FeatureLayer({
        title: null,
        portalItem: {
            id: polygonFillPortalItemId
        },
        layerId: polygonFillLayerId,
        outFields: ["*"],
        renderer: new renderers_1.SimpleRenderer({
            symbol: new symbols_1.SimpleMarkerSymbol({
                size: 1,
                color: null,
                outline: null
            })
        })
    });
});
//# sourceMappingURL=layerUtils.js.map