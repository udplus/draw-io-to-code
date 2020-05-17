import { stringify } from "querystring";

const fs = require("fs");
const xml2js = require("xml2js");
const { promisify } = require("util");

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const parser = new xml2js.Parser();

interface IDrawIOMXCell {
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

interface INode {
  id: number;
  oldObject: IDrawIOMXCell;
  type: string;
  value: string;
}

interface IEdge {
  id: number;
  oldObject: IDrawIOMXCell;
  source: number;
  target: number;
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

export const loadDiagramCells = async (filePath: String): Promise<any[]> => {
  const res = await readFileAsync(filePath);
  const xmlObject = await parser.parseStringPromise(res);
  return xmlObject.mxfile.diagram[0].mxGraphModel[0].root[0].mxCell;
};

const buildFileFromCells = (cells: IDrawIOMXCell[]): String => {
  const edges: IEdge[] = [];
  const nodes: INode[] = [];

  cells.forEach((cell: IDrawIOMXCell) => {
    const props = cell.$;

    if (props.edge === "1") {
      edges.push({
        id: parseInt(props.id),
        oldObject: cell,
        source: parseInt(props.source ? props.source : "") ?? undefined,
        target: parseInt(props.target ? props.target : "") ?? undefined,
      });
    } else if (props.vertex === "1") {
      nodes.push({
        id: parseInt(props.id),
        oldObject: cell,
        type: "thing",
        value: props.value ? props.value : "",
      });
    }
  });

  console.log(edges);
  console.log(nodes);
  return "blah";
};

export const generateFunctionFromDiagram = async (
  filePath: String
): Promise<any> => {
  const cells = await loadDiagramCells(filePath);

  //Write To File
  const writeFilePath = "dist/" + filePath.split("/")[1].split(".")[0] + ".js";
  const writtenFile = await writeFileAsync(
    writeFilePath,
    buildFileFromCells(cells)
  );
  return Promise.all([writtenFile]);
};
