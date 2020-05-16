//Imports
import { loadDiagramCells, generateFunctionFromDiagram } from "./main";
import { expect } from "chai";
import "mocha";
import { describe } from "mocha";
import fs from "fs";
import { promisify } from "util";

const deepEqualInAnyOrder = require("deep-equal-in-any-order");
const chai = require("chai");

const readFileAsync = promisify(fs.readFile);

chai.use(deepEqualInAnyOrder);

const fixtures = {
  identityFunction: "test_fixtures/identityFunction.drawio",
};

describe("Import DrawIO Files", () => {
  it("Imports the DrawIO File as an Object Without Crashing", async () => {
    const cells = await loadDiagramCells(fixtures.identityFunction);
    // console.log(cells);
    expect(cells).to.be.an.instanceof(Array);
    expect(cells.length).to.equal(5);
  });

  it("Converts the File to a Javascript Function as a String", async () => {
    const expectedJSFile = await (
      await readFileAsync("test_fixtures/identityFunction.js")
    ).toString();

    generateFunctionFromDiagram(fixtures.identityFunction);
  });
});
