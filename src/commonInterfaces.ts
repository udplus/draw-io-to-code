export type INodeTypes =
  | "input"
  | "output"
  | "logger"
  | "adder"
  | "decision"
  | "unknown";

export interface INode {
  id: number;
  oldObject: IDrawIOMXCell;
  type: INodeTypes;
  value: string;
  generator: any;
}

export interface IEdge {
  id: number;
  oldObject: IDrawIOMXCell;
  source: number;
  target: number;
  styles: any[];
}

//DRAW IO Stuff
export interface IDrawIOMXCell {
  $: IDrawIOMXCellProperties; //Properties of the Cell
  mxGeometry?: IDrawIOMXGeometryCell; //Child
}

//Highly Dependant on which cell is present
interface IDrawIOMXCellProperties {
  id: string;
  style?: string;
  value?: string;
  parent?: string;
  source?: string;
  target?: string;
  vertex?: string;
  edge?: string;
}

interface IDrawIOStyles {
  shape: string;
  [style: string]: string;
}

interface IDrawIOMXGeometryCell {
  $: IDrawIOMXGeometryCellProperties;
  Array?: any;
}
interface IDrawIOMXGeometryCellProperties {
  x?: string;
  y?: string;
  width?: string;
  height?: string;
  relative?: string;
  as: string;
}
