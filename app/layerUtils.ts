import FeatureLayer = require("esri/layers/FeatureLayer");
import { SimpleRenderer } from "esri/renderers";
import { SimpleMarkerSymbol, TextSymbol, SimpleFillSymbol, SimpleLineSymbol } from "esri/symbols";
import { UniqueValueRenderer } from "esri/rasterRenderers";
import Circle = require("esri/geometry/Circle");
import Color = require("esri/Color");
import Graphic = require("esri/Graphic");
import { createNewInfectionPercentTotalExpression } from "./expressionUtils";
import { Point, Extent, Polygon } from "esri/geometry";
import { annotations, Annotation } from "./annotations";

// Data from Johns Hopkins University
// "https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series";

export const polygonFillPortalItemId = "45389b90ed234ab4be65820e081254c4";
export const polygonFillLayerId = 2;  // polygons

const outlineColor = "#ece8e8";

export const wkid = 102008;

export const separator = "_";
export const prefix = "DAYSTRING_";

export const infectionsPopulationLayer = new FeatureLayer({
  title: null,
  portalItem: {
    id: polygonFillPortalItemId
  },
  layerId: polygonFillLayerId,
  outFields: ["*"],
  renderer: new SimpleRenderer({
    symbol: new SimpleMarkerSymbol({
      size: 1,
      color: null,
      outline: null
    })
  })
});

export const annotationLayer = new FeatureLayer({
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
    wkid
  },
  geometryType: "polygon",
  objectIdField: "OBJECTID",
  labelingInfo: [{
    labelExpressionInfo: {
      expression: "$feature.label"
    },
    symbol: new TextSymbol({
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
  renderer: new UniqueValueRenderer({
    valueExpression: `IIF( !IsEmpty( $feature.label ), 'Label', 'No Label')`,
    uniqueValueInfos: [{
      value: "No Label",
      symbol: new SimpleFillSymbol({
        color: new Color([150, 150, 150]),
        style: "none",
        outline: new SimpleLineSymbol({
          style: "short-dash",
          width: 2,
          color: new Color("#4d4b48")
        })
      })
    }],
    defaultSymbol: new SimpleFillSymbol({
      color: new Color([255,0,0,0.01]),
      outline: null
    })
  }),
  legendEnabled: false,
  source: annotations.map( createAnnotationGraphics ).reduce((acc, val) => acc.concat(val), [])
});

let nextId: number = 0;
export function createAnnotationGraphics(params: Annotation, index: number): Graphic[] {
  const { begin, end, label, geometry } = params;

  return [
    new Graphic({
      attributes: {
        begin: begin.getTime(),
        end: end.getTime(),
        label: null,
        OBJECTID: nextId++,
        labelId: index,
      },
      geometry
    }),
    new Graphic({
      attributes: {
        begin: begin.getTime(),
        end: end.getTime(),
        label,
        OBJECTID: nextId++,
        labelId: nextId,
      },
      geometry: new Circle({
        center: new Point({
          x: geometry.extent.xmax,
          y: geometry.extent.ymax,
          spatialReference: { wkid }
        }),
        radiusUnit: "meters",
        radius: 1000,
        spatialReference: { wkid }
      })
    }),
  ];
}