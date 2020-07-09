define(["require", "exports", "esri/layers/FeatureLayer", "esri/layers/GroupLayer", "esri/layers/ImageryLayer", "esri/renderers", "esri/symbols"], function (require, exports, FeatureLayer, GroupLayer, ImageryLayer, renderers_1, symbols_1) {
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
        }),
        blendMode: "source-in"
    });
    exports.blendedLayer = new GroupLayer({
        layers: [
            new ImageryLayer({
                portalItem: {
                    id: "0f83177f15d640ed911bdcf6614810a5"
                },
                legendEnabled: false
            }),
            exports.infectionsPopulationLayer
        ],
        blendMode: "darken"
    });
});
//# sourceMappingURL=layerUtils.js.map