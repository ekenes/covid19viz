define(["require", "exports", "esri/layers/FeatureLayer", "esri/renderers", "esri/symbols", "esri/rasterRenderers", "esri/geometry/Circle", "esri/Color", "esri/Graphic", "esri/geometry", "./annotations"], function (require, exports, FeatureLayer, renderers_1, symbols_1, rasterRenderers_1, Circle, Color, Graphic, geometry_1, annotations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Data from Johns Hopkins University
    // "https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series";
    exports.polygonFillPortalItemId = "45389b90ed234ab4be65820e081254c4";
    exports.polygonFillLayerId = 2; // polygons
    var outlineColor = "#ece8e8";
    exports.wkid = 102008;
    exports.separator = "_";
    exports.prefix = "DAYSTRING_";
    exports.infectionsPopulationLayer = new FeatureLayer({
        title: null,
        portalItem: {
            id: exports.polygonFillPortalItemId
        },
        layerId: exports.polygonFillLayerId,
        outFields: ["*"],
        renderer: new renderers_1.SimpleRenderer({
            symbol: new symbols_1.SimpleMarkerSymbol({
                size: 1,
                color: null,
                outline: null
            })
        })
    });
    exports.annotationLayer = new FeatureLayer({
        // blendMode: "color-burn",
        fields: [{
                name: "OBJECTID",
                type: "oid"
            }, {
                name: "begin",
                alias: "begin",
                type: "date"
            }, {
                name: "end",
                alias: "end",
                type: "date"
            }, {
                name: "label",
                alias: "label",
                type: "string"
            }],
        timeInfo: {
            startField: "begin",
            endField: "end"
        },
        spatialReference: {
            wkid: exports.wkid
        },
        geometryType: "polygon",
        objectIdField: "OBJECTID",
        labelingInfo: [{
                labelExpressionInfo: {
                    expression: "$feature.label"
                },
                symbol: new symbols_1.TextSymbol({
                    font: {
                        family: "BellTopo Sans",
                        size: 14
                    },
                    xoffset: 20,
                    haloSize: 1.5,
                    haloColor: new Color(outlineColor)
                }),
                deconflictionStrategy: "none"
            }],
        renderer: new rasterRenderers_1.UniqueValueRenderer({
            valueExpression: "IIF( !IsEmpty( $feature.label ), 'Label', 'No Label')",
            uniqueValueInfos: [{
                    value: "No Label",
                    symbol: new symbols_1.SimpleFillSymbol({
                        color: new Color([150, 150, 150]),
                        style: "none",
                        outline: new symbols_1.SimpleLineSymbol({
                            style: "short-dash",
                            width: 2,
                            color: new Color("#4d4b48")
                        })
                    })
                }],
            defaultSymbol: new symbols_1.SimpleFillSymbol({
                color: new Color([255, 0, 0, 0.01]),
                outline: null
            })
        }),
        legendEnabled: false,
        source: annotations_1.annotations.map(createAnnotationGraphics).reduce(function (acc, val) { return acc.concat(val); }, [])
    });
    var nextId = 0;
    function createAnnotationGraphics(params, index) {
        var begin = params.begin, end = params.end, label = params.label, geometry = params.geometry;
        return [
            new Graphic({
                attributes: {
                    begin: begin.getTime(),
                    end: end.getTime(),
                    label: null,
                    OBJECTID: nextId++,
                    labelId: index,
                },
                geometry: geometry
            }),
            new Graphic({
                attributes: {
                    begin: begin.getTime(),
                    end: end.getTime(),
                    label: label,
                    OBJECTID: nextId++,
                    labelId: nextId,
                },
                geometry: new Circle({
                    center: new geometry_1.Point({
                        x: geometry.extent.xmax,
                        y: geometry.extent.ymax,
                        spatialReference: { wkid: exports.wkid }
                    }),
                    radiusUnit: "meters",
                    radius: 1000,
                    spatialReference: { wkid: exports.wkid }
                })
            }),
        ];
    }
    exports.createAnnotationGraphics = createAnnotationGraphics;
});
//# sourceMappingURL=layerUtils.js.map