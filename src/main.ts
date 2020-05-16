const fs = require("fs");
const xml2js = require("xml2js");
const { promisify } = require("util");

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const parser = new xml2js.Parser();

export const loadDiagramCells = async (filePath: String): Promise<any[]> => {
  const res = await readFileAsync(filePath);
  const xmlObject = await parser.parseStringPromise(res);
  return xmlObject.mxfile.diagram[0].mxGraphModel[0].root[0].mxCell;
};

export const generateFunctionFromDiagram = async (
  filePath: String
): Promise<any> => {
  const cells = await loadDiagramCells(filePath);

  //Write To File
  const writeFilePath = "dist/" + filePath.split("/")[1].split(".")[0] + ".js";
  const writtenFile = await writeFileAsync(
    writeFilePath,
    "function identityFunction(input) {\n  return input;\n}\n"
  );
  return Promise.all([writtenFile]);
};
