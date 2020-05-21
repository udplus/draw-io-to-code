import { INode } from "./commonInterfaces";

export const start = (fileName: string, inputValues: string): string => {
  return `function ${fileName}(${inputValues}) {\n`;
};

export const end = (nodeConnectingToOutput: string | undefined): string => {
  return nodeConnectingToOutput
    ? `  return ${nodeConnectingToOutput};\n}\n`
    : `}\n`;
};

const logger = (whatToLog: string): string => {
  return `console.log(${whatToLog});\n`;
};

const adder = (resultName: string, a: string, b: string): string => {
  return `const ${resultName} = ${a} + ${b};`;
};

const decision = (nodesConnectingToNode: INode[]): string => {
  console.log(nodesConnectingToNode);
  return `const decision1 = ${test} ? a : b;`;
};

const unknown = (): string => "";

export const builders = {
  logger,
  adder,
  decision,
  unknown,
};
