define(["require", "exports", "esri/layers/FeatureLayer", "esri/layers/support/LabelClass", "esri/Color", "esri/renderers", "esri/symbols"], function (require, exports, FeatureLayer, LabelClass, Color, renderers_1, symbols_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Data from Johns Hopkins University
    // "https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series";
    exports.polygonFillPortalItemId = "3d170bd624804d59b3009cafa5294a66";
    exports.polygonFillLayerId = 0; // 2020
    exports.infectionsPopulationLayer2020 = new FeatureLayer({
        title: null,
        portalItem: {
            id: exports.polygonFillPortalItemId
        },
        copyright: "App and maps by <a href=\"https://github.com/ekenes\">Kristian Ekenes</a>",
        layerId: exports.polygonFillLayerId,
        outFields: ["*"],
        opacity: 1,
        renderer: new renderers_1.SimpleRenderer({
            symbol: new symbols_1.SimpleMarkerSymbol({
                size: 1,
                color: null,
                outline: null
            })
        })
    });
    exports.infectionsPopulationLayer2021 = new FeatureLayer({
        title: null,
        portalItem: {
            id: exports.polygonFillPortalItemId
        },
        opacity: 0.01,
        copyright: "App and maps by <a href=\"https://github.com/ekenes\">Kristian Ekenes</a>",
        layerId: 1,
        outFields: ["*"],
        renderer: new renderers_1.SimpleRenderer({
            symbol: new symbols_1.SimpleMarkerSymbol({
                size: 1,
                color: null,
                outline: null
            })
        })
    });
    exports.fillColor = "#ece8e8";
    exports.citiesContextLayer = new FeatureLayer({
        opacity: 0.5,
        portalItem: {
            id: "85d0ca4ea1ca4b9abf0c51b9bd34de2e"
        },
        title: "Major cities",
        definitionExpression: "POPULATION > 500000",
        legendEnabled: false,
        popupEnabled: false,
        renderer: new renderers_1.SimpleRenderer({
            symbol: new symbols_1.SimpleMarkerSymbol({
                size: 1,
                color: null,
                outline: null
            })
        }),
        labelingInfo: [
            new LabelClass({
                labelExpressionInfo: {
                    expression: "$feature.name"
                },
                symbol: new symbols_1.TextSymbol({
                    color: new Color([75, 75, 75]),
                    haloColor: new Color([236, 232, 232, 1]),
                    haloSize: 1,
                    font: {
                        size: "10pt",
                        family: "Noto Sans",
                        style: "normal",
                        weight: "normal"
                    }
                }),
                labelPlacement: "above-right"
            })
        ]
    });
    function setActiveLayer(d) {
        var activeLayer = d.getFullYear() < 2021 ? exports.infectionsPopulationLayer2020 : exports.infectionsPopulationLayer2021;
        activeLayer.opacity = 1;
        activeLayer.popupEnabled = true;
        activeLayer.legendEnabled = true;
        return activeLayer;
    }
    exports.setActiveLayer = setActiveLayer;
    function setInactiveLayer(d) {
        var inactiveLayer = d.getFullYear() < 2021 ? exports.infectionsPopulationLayer2021 : exports.infectionsPopulationLayer2020;
        inactiveLayer.opacity = 0.01;
        inactiveLayer.popupEnabled = false;
        inactiveLayer.legendEnabled = false;
        return inactiveLayer;
    }
    exports.setInactiveLayer = setInactiveLayer;
});
//# sourceMappingURL=layerUtils.js.map