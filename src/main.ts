const fs = require("fs");
const xml2js = require("xml2js");
const { promisify } = require("util");

const readFileAsync = promisify(fs.readFile);

const parser = new xml2js.Parser();

export const loadDiagramCells = async (filePath: String): Promise<any[]> => {
  const res = await readFileAsync(filePath);
  console.log("--- File Loaded --- 🥘");
  const xmlObject = await parser.parseStringPromise(res);
  return xmlObject.mxfile.diagram[0].mxGraphModel[0].root[0].mxCell;
};
