define(["require", "exports", "esri/renderers/support/ClassBreakInfo", "esri/Color", "esri/symbols"], function (require, exports, ClassBreakInfo, Color, symbols_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function createBarSymbol(params) {
        var color = params.color, height = params.height;
        var xwidth = 2;
        var halfWidth = xwidth * 0.5;
        var xmax = 17;
        var xmin = 0;
        var xmid = (xmax - xmin) * 0.5;
        return new symbols_1.CIMSymbol({
            data: {
                type: "CIMSymbolReference",
                symbol: {
                    type: "CIMPointSymbol",
                    symbolLayers: [
                        {
                            type: "CIMVectorMarker",
                            enable: true,
                            anchorPoint: { x: 0, y: -0.5 },
                            anchorPointUnits: "Relative",
                            frame: { xmin: xmin, ymin: 0.0, xmax: xmax, ymax: height },
                            size: height,
                            markerGraphics: [
                                {
                                    type: "CIMMarkerGraphic",
                                    geometry: {
                                        rings: [
                                            [
                                                [xmid - halfWidth, 0],
                                                [xmid - halfWidth, height],
                                                [xmid + halfWidth, height],
                                                [xmid + halfWidth, 0],
                                                [xmid - halfWidth, 0],
                                            ]
                                        ]
                                    },
                                    symbol: {
                                        type: "CIMPolygonSymbol",
                                        symbolLayers: [
                                            {
                                                type: "CIMSolidFill",
                                                enable: true,
                                                color: new Color(color).toJSON()
                                            }
                                        ]
                                    }
                                }
                            ],
                            scaleSymbolsProportionally: true,
                            respectFrame: true
                        }
                    ]
                }
            }
        });
    }
    exports.createBarSymbol = createBarSymbol;
    function createClassBreakInfos(params) {
        var min = params.min, max = params.max, numClasses = params.numClasses;
        var range = (max - min) / numClasses;
        var infos = [];
        for (var i = min; i <= max; i += range) {
            infos.push(new ClassBreakInfo({
                minValue: i,
                maxValue: i + range,
                symbol: createBarSymbol({
                    color: "rgba(200,0,0,0.5)",
                    height: (i) * 0.5 // divide by 20
                })
            }));
        }
        return infos;
    }
    exports.createClassBreakInfos = createClassBreakInfos;
});
//# sourceMappingURL=symbolUtils.js.map