import Lexer from "./lexer/lexer";
import Parser from "./parser/parser";

// read file using fs
const fs = require("fs");
const file = fs.readFileSync("examples/1.do", "utf8");

var lexer = new Lexer(file);

// parser
var parser = new Parser(lexer);

console.log(parser.ParseProgram());
