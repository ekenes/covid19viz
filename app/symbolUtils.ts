import esri = __esri;
import ClassBreakInfo = require("esri/renderers/support/ClassBreakInfo");
import Color = require("esri/Color");
import { CIMSymbol } from "esri/symbols";

interface CreateSymbolLayerParams {
  color?: Color | string | number[],
  height: number
}

export function createBarSymbol (params: CreateSymbolLayerParams){
  const { color, height } = params;

  const xwidth = 2;
  const halfWidth = xwidth * 0.5;
  const xmax = 17;
  const xmin = 0;
  const xmid = (xmax - xmin ) * 0.5;

  return new CIMSymbol({
    data: {
      type: `CIMSymbolReference`,
      symbol: {
        type: `CIMPointSymbol`,
        symbolLayers: [
          {
            type: "CIMVectorMarker",
            enable: true,
            anchorPoint: { x: 0, y: -0.5 },
            anchorPointUnits: "Relative",
            frame: { xmin, ymin: 0.0, xmax, ymax: height },
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
  })
}

interface ClassBreakInfoParams {
  min: number,
  max: number,
  numClasses: number
}

export function createClassBreakInfos (params: ClassBreakInfoParams): ClassBreakInfo[] {
  const { min, max, numClasses } = params;
  const range = ( max - min) / numClasses;

  const infos: ClassBreakInfo[] = [];

  for (let i = min; i <= max; i+=range){
    infos.push(new ClassBreakInfo({
      minValue: i,
      maxValue: i+range,
      symbol: createBarSymbol({
        color: "rgba(200,0,0,0.5)",
        height: (i) * 0.5 // divide by 20
      })
    }))
  }

  return infos;
}