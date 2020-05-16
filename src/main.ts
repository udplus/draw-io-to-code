const fs = require("fs");
const xml2js = require("xml2js");
const { promisify } = require("util");

const readFileAsync = promisify(fs.readFile);

const parser = new xml2js.Parser();

export const loadXML = async (filePath: String) => {
  const res = await readFileAsync(filePath);
  console.log("File Loaded");
  parser.parseString(res, function (err: any, result: any) {
    console.dir(result.mxfile.diagram[0].mxGraphModel[0].root[0].mxCell);
    console.log("Done");
  });
};
