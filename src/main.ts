const fs = require("fs");
const xml2js = require("xml2js");
const { promisify } = require("util");

import { start, end, builders } from "./nodeFunctionBuilders";

import { INodeTypes, INode, IEdge, IDrawIOMXCell } from "./commonInterfaces";

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const parser = new xml2js.Parser();

interface ITypeKeywordMap {
  [type: string]: string[];
}

export const loadDiagramCells = async (filePath: String): Promise<any[]> => {
  const res = await readFileAsync(filePath);
  const xmlObject = await parser.parseStringPromise(res);
  return xmlObject.mxfile.diagram[0].mxGraphModel[0].root[0].mxCell;
};

const typeDecider = (shape: string): INodeTypes => {
  const typeKeywordMap: ITypeKeywordMap = {
    input: ["start"],
    output: ["terminator"],
    logger: ["display"],
    decision: ["decision"],
  };

  for (const type in typeKeywordMap) {
    const keywords = typeKeywordMap[type];

    for (const keyword of keywords) {
      if (shape.includes(keyword)) {
        if (type === "input") return "input";
        if (type === "output") return "output";
        if (type === "logger") return "logger";
        if (type === "adder") return "adder";
        if (type === "decision") return "decision";
      }
    }
  }
  return "unknown";
};

const getStylePairs = (styleString: string | undefined): any[] => {
  if (styleString === undefined) return [];
  return styleString
    ?.slice(0, -1)
    .split(";")
    .map((style) => {
      return style.split("=");
    });
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
  const ids: any = {};
  const typesCount: any = {};

  //Arrange Cell Types
  cells.forEach((cell: IDrawIOMXCell) => {
    const props = cell.$;

    if (props.edge === "1") {
      //If Edge
      edges.push({
        id: parseInt(props.id),
        oldObject: cell,
        source: parseInt(props.source ? props.source : ""),
        target: parseInt(props.target ? props.target : ""),
        styles: getStylePairs(props.style),
      });
    } else if (props.vertex === "1" && props.style) {
      //IF Vertex

      const shape = getStylePairs(props.style).find(
        (pair) => pair[0] == "shape"
      )[1];

      const type = typeDecider(shape);
      const id = parseInt(props.id);

      const node: INode = {
        id,
        oldObject: cell,
        type,
        value: props.value ? props.value : `${type}${id}`,
        generator: () => {},
      };

      if (node.type === "input") {
        node.generator = start;
        inputs.push(node);
      } else if (node.type === "output") {
        node.generator = end;
        output = node;
      } else {
        node.generator = builders[node.type];
        nodes.push(node);
      }
      ids[node.id] = node;
    }
  });

  //Build Input
  const inputValues = inputs
    .map((inputNode) => {
      return inputNode.value;
    })
    .join(",");
  const functionStringStart = inputs[0].generator(fileName, inputValues);

  //Build Output
  let nodeConnectingToOutput = { value: "" };
  edges.forEach((edge) => {
    if (edge.target === output?.id) {
      nodeConnectingToOutput = ids[edge.source];
    }
  });
  const functionStringEnd = output?.generator(nodeConnectingToOutput.value);

  //Build Middle Items
  let functionStringMiddle = "";
  nodes.forEach((node) => {
    let nodesConnectingToNode: INode[] = [];
    let edgesConnectingToNode: IEdge[] = [];
    edges.forEach((edge) => {
      if (edge.target === node.id) {
        nodesConnectingToNode.push(ids[edge.source]);
        edgesConnectingToNode.push(edge);
      }
    });
    functionStringMiddle +=
      "  " + node.generator(node, nodesConnectingToNode, edgesConnectingToNode);
  });

  // console.log(cells);
  // console.log(edges);

  return functionStringStart + functionStringMiddle + functionStringEnd;
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
