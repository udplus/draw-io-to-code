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

interface IDrawIOStyles {
  shape: string;
  [style: string]: string;
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

interface ITypeKeywordMap {
  [type: string]: string[];
}

export const loadDiagramCells = async (filePath: String): Promise<any[]> => {
  const res = await readFileAsync(filePath);
  const xmlObject = await parser.parseStringPromise(res);
  return xmlObject.mxfile.diagram[0].mxGraphModel[0].root[0].mxCell;
};

const typeDecider = (shape: string): string => {
  const typeKeywordMap: ITypeKeywordMap = {
    input: ["start"],
    output: ["terminator"],
  };

  for (const type in typeKeywordMap) {
    const keywords = typeKeywordMap[type];

    for (const keyword of keywords) {
      if (shape.includes(keyword)) {
        return type;
      }
    }
  }
  return "unknown";
};

const buildFileFromCells = (
  cells: IDrawIOMXCell[],
  fileName: string
): String => {
  // console.log(cells);

  const edges: IEdge[] = [];
  const nodes: INode[] = [];
  const inputs: INode[] = [];
  let output: INode | undefined;

  cells.forEach((cell: IDrawIOMXCell) => {
    const props = cell.$;

    if (props.edge === "1") {
      //If Edge
      edges.push({
        id: parseInt(props.id),
        oldObject: cell,
        source: parseInt(props.source ? props.source : ""),
        target: parseInt(props.target ? props.target : ""),
      });
    } else if (props.vertex === "1" && props.style) {
      //IF Vertex
      const stylePairs: any[] = props.style
        ?.slice(0, -1)
        .split(";")
        .map((style) => {
          return style.split("=");
        });

      const shape = stylePairs.find((pair) => pair[0] == "shape")[1];

      const node = {
        id: parseInt(props.id),
        oldObject: cell,
        type: typeDecider(shape),
        value: props.value ? props.value : "",
      };

      if (node.type === "input") {
        inputs.push(node);
      } else if (node.type === "output") {
        output = node;
      } else {
        nodes.push(node);
      }
    }
  });

  // console.log(edges);
  // console.log(nodes);
  // console.log(inputs);
  // console.log(output);

  //Build Input
  const inputValues = inputs
    .map((inputNode) => {
      return inputNode.value;
    })
    .join(",");
  const functionStringStart = `function ${fileName}(${inputValues}) {\n`;

  //Build Output
  const functionStringEnd = output ? `  return ${output.value};\n}\n` : `}\n`;

  //Build Middle Items

  return functionStringStart + functionStringEnd;
};

export const generateFunctionFromDiagram = async (
  filePath: String
): Promise<any> => {
  const cells = await loadDiagramCells(filePath);

  const fileName = filePath.split("/")[1].split(".")[0];

  //Write To File
  const writeFilePath = "dist/" + fileName + ".js";
  const writtenFile = await writeFileAsync(
    writeFilePath,
    buildFileFromCells(cells, fileName)
  );
  return Promise.all([writtenFile]);
};
