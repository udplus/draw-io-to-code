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

const testFixtures = [
  "identityFunction",
  "simpleConsoleLogFunction",
  "ifStatement",
  "adderTest",
];

describe("Import DrawIO Files", () => {
  it("Imports the DrawIO File as an Object Without Crashing", async () => {
    const cells = await loadDiagramCells(
      "test_fixtures/identityFunction.drawio"
    );
    // console.log(cells);
    expect(cells).to.be.an.instanceof(Array);
    expect(cells.length).to.equal(5);
  });

  context("Converts the File to a Javascript Function as a String", () => {
    testFixtures.forEach((fixture) => {
      it(`Should correctly convert -> ${fixture}`, async () => {
        const expectedJSFile = await (
          await readFileAsync(`test_fixtures/${fixture}.js`)
        ).toString();

        const fileWritten = await generateFunctionFromDiagram(
          `test_fixtures/${fixture}.drawio`
        );

        const writtenJSFile = await (
          await readFileAsync(`dist/${fixture}.js`)
        ).toString();

        expect(writtenJSFile).to.equal(expectedJSFile);
      });
    });
  });
});
