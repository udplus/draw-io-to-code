# draw-io-to-code
A library to transpile draw.io XML to Javascript as a visual DSL.  
This Typescript library works by taking local `.drawio` XML based files and converting them into Javascript functions.
It currently supports the use of the following items from the stanard draw-io `Flowchart` shapes:

- Start (either one)    -> Function Inputs
- Terminator            -> Function Return Value
- Decision              -> Ternerary Operater Statement
- Display               -> Console.log
- Summing Function      -> Basic Addition
 
It works well alongside the VSCode [DrawIO extension](https://github.com/hediet/vscode-drawio)


## Use

To initialise and install all required dependancies:
```
yarn
```

To run the tests:
```
yarn test
```

## Example
The following flowchart:
 
> ![Flowchart Example 1](/misc/drawio-screenshot-1.png)  

Is transpiled to the following code, where the variable names are derived from the object IDs:
```javascript
function ifStatement(input2, input7, input9) {
  const decision4 = input2 ? input9 : input7;
  return decision4;
}
```