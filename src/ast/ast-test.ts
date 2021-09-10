import { ASTProgram, VarStatement, Identifier } from "./ast";
import Token, { TokenType } from "../token/token";
import Test from "../test/test";

export function TestAst(t: Test) {
  console.log("║  └ TestString");
  TestString(t);
}

export function TestString(t: Test) {
  let program = new ASTProgram();
  program.Statements = [
    new VarStatement(
      new Token(TokenType.VAR, "var"),
      new Identifier(new Token(TokenType.IDENT, "myVar"), "myVar"),
      new Identifier(new Token(TokenType.IDENT, "anotherVar"), "anotherVar")
    ),
  ];

  t.Assert(
    program.String() === "let myVar = anotherVar;",
    "program.String() wrong. got=%s",
    program.String()
  );
}
