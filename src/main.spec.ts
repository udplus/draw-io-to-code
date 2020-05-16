//Imports
import { loadDiagramCells } from "./main";
import { expect } from "chai";
import "mocha";
import { describe } from "mocha";

const deepEqualInAnyOrder = require("deep-equal-in-any-order");
const chai = require("chai");

chai.use(deepEqualInAnyOrder);

describe("Import DrawIO Files", () => {
  it("Imports the DrawIO File as an Object Without Crashing", async () => {
    const cells = await loadDiagramCells(
      "test_diagrams/simpleConsoleLogFunction.drawio"
    );
    console.log(cells);
    expect(cells).to.be.an.instanceof(Array);
    expect(cells.length).to.equal(8);
  });
});
