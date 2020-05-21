import { INode, IEdge } from "./commonInterfaces";

export const start = (fileName: string, inputValues: string): string => {
  return `function ${fileName}(${inputValues}) {\n`;
};

export const end = (nodeConnectingToOutput: string | undefined): string => {
  return nodeConnectingToOutput
    ? `  return ${nodeConnectingToOutput};\n}\n`
    : `}\n`;
};

const logger = (
  node: INode | undefined,
  nodesConnectingToNode: INode[],
  edgesConnectingToNode: IEdge[] | undefined
): string => {
  return `console.log(${nodesConnectingToNode[0].value});\n`;
};

const adder = (
  node: INode,
  nodesConnectingToNode: INode[],
  edgesConnectingToNode: IEdge[]
): string => {
  let left = "false";
  let right = "false";

  edgesConnectingToNode.forEach((edge: IEdge): void => {
    let x = edge.styles.find((pair) => pair[0] == "entryX")[1];

    nodesConnectingToNode.forEach((node: INode): void => {
      if (edge.source === node.id) {
        // "0": "left",
        // "1": "right",
        if (x === "0") {
          left = node.value;
        } else if (x === "1") {
          right = node.value;
        }
      }
    });
  });

  return `const ${node.value} = ${left} + ${right};\n`;
};

const decision = (
  node: INode,
  nodesConnectingToNode: INode[],
  edgesConnectingToNode: IEdge[]
): string => {
  let trueCondition = "false";
  let falseCondition = "false";
  let test = "false";

  edgesConnectingToNode.forEach((edge: IEdge): void => {
    let x = edge.styles.find((pair) => pair[0] == "entryX")[1];

    nodesConnectingToNode.forEach((node: INode): void => {
      if (edge.source === node.id) {
        // "0.5": "test",
        // "0": "trueCondition",
        // "1": "falseCondition",
        if (x === "0.5") {
          test = node.value;
        } else if (x === "0") {
          trueCondition = node.value;
        } else if (x === "1") {
          falseCondition = node.value;
        }
      }
    });
  });

  return `const ${node.value} = ${test} ? ${trueCondition} : ${falseCondition};\n`;
};

const unknown = (): string => "";

export const builders = {
  logger,
  adder,
  decision,
  unknown,
};
