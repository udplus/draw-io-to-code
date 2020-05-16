//Imports
import { loadXML } from "./main";
import { expect } from "chai";
import "mocha";
import { describe } from "mocha";

const deepEqualInAnyOrder = require("deep-equal-in-any-order");
const chai = require("chai");

chai.use(deepEqualInAnyOrder);

describe("Import DrawIO Files", () => {
  it("Imports the DrawIO File as an Object Without Crashing", () => {
    loadXML("test_diagrams/simpleConsoleLogFunction.drawio");
  });
});
