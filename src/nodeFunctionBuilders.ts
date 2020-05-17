export const logger = (whatToLog: string): string => {
  return `console.log(${whatToLog});\n`;
};

export const adder = (resultName: string, a: string, b: string): string => {
  return `const ${resultName} = ${a} + ${b};`;
};

export const ifStatement = (
  resultName: string,
  test: string,
  a: string,
  b: string
): string => {
  return `const ${resultName} = ${test} ? ${a} : ${b};`;
};
