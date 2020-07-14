import { Point } from "esri/geometry";
import geometryJSONUtils = require("esri/geometry/support/jsonUtils");

export interface Annotation {
  begin: Date,
  end: Date,
  label: string,
  center: Point,
  radius: number
}

export const annotations: Annotation[] = [{
  begin: new Date(2020,2,17),
  end: new Date(2020, 3, 12),
  label: `New York `,
  center: Point.fromJSON({"spatialReference":{"wkid":102008},"x":1733738.8170542917,"y":288875.3259413807}),
  radius: 400
}, {
  begin: new Date(2020,4,13),
  end: new Date(2020,4,22),
  label: `Midwest Outbreak`,
  center: Point.fromJSON({"spatialReference":{"wkid":102008},"x":15078.416498506907,"y":252056.56147777475}),
  radius: 300
}, {
  begin: new Date(2020,5,7),
  end: new Date(2020,6,13),
  label: `Arizona spikes`,
  center: Point.fromJSON({"spatialReference":{"wkid":102008},"x":-1546270.4623117347,"y":-683586.189569338}),
  radius: 200
}, {
  begin: new Date(2020,5,24),
  end: new Date(2020,6,13),
  label: `Texas surge`,
  center: Point.fromJSON({"spatialReference":{"wkid":102008},"x":-161998.1351179215,"y":-1097947.5886944677}),
  radius: 200
}, {
  begin: new Date(2020,5,24),
  end: new Date(2020,6,13),
  label: `Florida Surge`,
  center: Point.fromJSON({"spatialReference":{"wkid":102008},"x":1334800.1917992053,"y":-1224796.5522414544}),
  radius: 200
}];