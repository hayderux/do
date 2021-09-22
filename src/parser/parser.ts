import {
  AnnotationAST,
  ArrayLiteral,
  AstBoolean,
  ASTProgram,
  BlockStatement,
  CallExpression,
  CaseExpression,
  Comment,
  DecrementExpression,
  EnumElement,
  EnumLiteral,
  Expression,
  ExpressionStatement,
  FloatLiteral,
  ForLiteral,
  FunctionLiteral,
  HashLiteral,
  Identifier,
  IfExpression,
  ImportSpec,
  IncrementExpression,
  IndexExpression,
  InfixExpression,
  IntegerLiteral,
  InterfaceAST,
  InterfaceMember,
  NullLiteral,
  PrefixExpression,
  RangeLiteral,
  ReturnStatement,
  Statement,
  StringLiteral,
  SwitchExpression,
  UnionTypeAST,
  VarStatement,
  WhileLiteral,
} from "../ast/ast";
import Lexer from "../lexer/lexer";
import Token, { TokenType, TokenTypeName } from "../token/token";

enum Precedence {
  LOWEST = 1, //
  LOR = 2, // or
  LAND = 3, // and
  EQUALS = 4, // ==
  LESSGREATER = 5, // > or <
  SUM = 6, // +
  PRODUCT = 7, // *
  PREFIX = 8, // X or !X
  BITWISE = 9, // & | ^
  CALL = 10, // myFunction(X)
  INDEX = 11, // array[index]
}
export const precedences: { [index: string]: number } = {
  [TokenType.LOR]: Precedence.EQUALS,
  [TokenType.LAND]: Precedence.EQUALS,
  [TokenType.EQ]: Precedence.EQUALS,
  [TokenType.NOT_EQ]: Precedence.EQUALS,
  [TokenType.LT]: Precedence.LESSGREATER,
  [TokenType.LTE]: Precedence.LESSGREATER,
  [TokenType.GT]: Precedence.LESSGREATER,
  [TokenType.GTE]: Precedence.LESSGREATER,
  [TokenType.PLUS]: Precedence.SUM,
  [TokenType.MINUS]: Precedence.SUM,
  [TokenType.SLASH]: Precedence.PRODUCT,
  [TokenType.ASTERISK]: Precedence.PRODUCT,
  [TokenType.EXPONENT]: Precedence.PRODUCT,
  [TokenType.REM]: Precedence.PRODUCT,
  [TokenType.BIT_AND]: Precedence.BITWISE,
  [TokenType.BIT_OR]: Precedence.BITWISE,
  [TokenType.BIT_XOR]: Precedence.BITWISE,
  [TokenType.BIT_NOT]: Precedence.BITWISE,
  [TokenType.BIT_LSHIFT]: Precedence.BITWISE,
  [TokenType.BIT_RSHIFT]: Precedence.BITWISE,
  [TokenType.BIT_ZRSHIFT]: Precedence.BITWISE,
  [TokenType.RANGE]: Precedence.BITWISE,
  [TokenType.RANGE_INCL]: Precedence.BITWISE,
  [TokenType.LPAREN]: Precedence.CALL,
  [TokenType.LBRACKET]: Precedence.INDEX,
};

export default class Parser {
  l: Lexer;
  errors: string[] = [];
  comments: string[] = [];

  curToken: Token;
  peekToken: Token;

  prefixParseFns: { [index: string]: Function } = {};
  infixParseFns: { [index: string]: Function } = {};

  constructor(lexer: Lexer) {
    this.l = lexer;

    this.registerPrefix(TokenType.COMMENT, this.parseComment.bind(this));
    this.registerPrefix(TokenType.IDENT, this.parseIdentifier.bind(this));
    this.registerPrefix(TokenType.INCREMENT, this.parsePreIncrement.bind(this));
    this.registerPrefix(TokenType.DECREMENT, this.parsePreDecrement.bind(this));
    this.registerPrefix(TokenType.LT_INT, this.parseIntegerLiteral.bind(this));
    this.registerPrefix(TokenType.LI_FLOAT, this.parseFloatLiteral.bind(this));
    this.registerPrefix(
      TokenType.LT_STRING,
      this.parseStringLiteral.bind(this)
    );
    this.registerPrefix(TokenType.BANG, this.parsePrefixExpression.bind(this));
    this.registerPrefix(TokenType.MINUS, this.parsePrefixExpression.bind(this));
    this.registerPrefix(
      TokenType.BIT_NOT,
      this.parsePrefixExpression.bind(this)
    );

    this.registerPrefix(TokenType.TRUE, this.parseBoolean.bind(this));
    this.registerPrefix(TokenType.FALSE, this.parseBoolean.bind(this));
    // null
    this.registerPrefix(TokenType.NULL, this.parseNull.bind(this));
    this.registerPrefix(
      TokenType.LPAREN,
      this.parseGroupedExpression.bind(this)
    );
    // model
    // enum
    this.registerPrefix(TokenType.ENUM, this.parseEnumStatement.bind(this));
    this.registerPrefix(TokenType.IMPORT, this.parseImportSpec.bind(this));
    this.registerPrefix(TokenType.IF, this.parseIfExpression.bind(this));
    // switch
    this.registerPrefix(TokenType.SWITCH, this.parseSwitchStatement.bind(this));
    this.registerPrefix(
      TokenType.FUNCTION,
      this.parseFunctionLiteral.bind(this)
    );
    this.registerPrefix(TokenType.WHILE, this.parseWhileLiteral.bind(this));
    this.registerPrefix(TokenType.FOR, this.parseForLiteral.bind(this));
    this.registerPrefix(TokenType.LBRACKET, this.parseArrayLiteral.bind(this));
    this.registerPrefix(TokenType.LBRACE, this.parseHashLiteral.bind(this));

    [
      TokenType.PLUS,
      TokenType.MINUS,
      TokenType.SLASH,
      TokenType.ASTERISK,
      TokenType.EXPONENT,
      TokenType.EQ,
      TokenType.NOT_EQ,
      TokenType.LT,
      TokenType.LTE,
      TokenType.GT,
      TokenType.GTE,
      TokenType.REM,
      TokenType.LAND,
      TokenType.LOR,
      TokenType.BIT_AND,
      TokenType.BIT_OR,
      TokenType.BIT_XOR,
      TokenType.BIT_LSHIFT,
      TokenType.BIT_RSHIFT,
      TokenType.BIT_ZRSHIFT,
      TokenType.RANGE,
      TokenType.RANGE_INCL,
    ].forEach((value) =>
      this.registerInfix(value, this.parseInfixExpression.bind(this))
    );

    this.registerInfix(TokenType.LPAREN, this.parseCallExpression.bind(this));
    this.registerInfix(
      TokenType.LBRACKET,
      this.parseIndexExpression.bind(this)
    );

    // equivalent to calling this.nextToken() twice
    this.peekToken = this.l.NextToken();
    this.curToken = this.peekToken;
    this.peekToken = this.l.NextToken();
  }

  Errors() {
    return this.errors;
  }

  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.l.NextToken();
  }

  ParseProgram() {
    let program = new ASTProgram();

    while (!this.curTokenIs(TokenType.EOF)) {
      let stmt = this.parseStatement();
      if (stmt !== null) {
        program.Statements.push(stmt);
      }
      this.nextToken();
    }

    return program;
  }

  parseStatement(): Statement | null {
    switch (this.curToken.Type) {
      case TokenType.VAR:
        return this.parseVarStatement();
      case TokenType.RETURN:
        return this.parseReturnStatement();
      case TokenType.TYPE:
        return this.parseTypeDeclaration();
      case TokenType.MODEL:
        return this.parseInterface();
      default:
        if (this.isAnnotation()) {
          return this.parseAnnotation();
        } else {
          return this.parseExpressionStatement();
        }
    }
  }
  // check if is variable declaration
  // e.g. name = "hayder";
  // e.g. name = 15;
  isVariableDeclaration(): boolean {
    return (
      this.curTokenIs(TokenType.IDENT) && this.peekTokenIs(TokenType.ASSIGN)
    );
  }

  // name = expr;
  // age = 15;
  // name = "steve";
  // list = [1, 2, 3];
  parseVarStatement(): Statement | null {
    let curToken = this.curToken;
    let index: IndexExpression | null = null;
    this.nextToken();
    let name = new Identifier(this.curToken, this.curToken.Literal);
    var typedef = null;

    if (this.peekTokenIs(TokenType.LBRACKET)) {
      this.nextToken();
      index = this.parseIndexExpression(name);
    }

    if (!this.expectPeek(TokenType.ASSIGN)) {
      return null;
    }

    this.nextToken();

    let value = this.parseExpression(Precedence.LOWEST);

    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return new VarStatement(curToken, name, value, index, typedef);
  }

  parseReturnStatement() {
    let stmt = new ReturnStatement(this.curToken);

    this.nextToken();

    stmt.ReturnValue = this.parseExpression(Precedence.LOWEST);

    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpressionStatement() {
    let curToken = this.curToken;

    let Expression = this.parseExpression(Precedence.LOWEST);

    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return new ExpressionStatement(curToken, Expression);
  }

  parseExpression(precedence: number) {
    if (!this.prefixParseFns[this.curToken.Type]) {
      this.noPrefixParseFnError(this.curToken);
      return null;
    }

    let prefix = this.prefixParseFns[this.curToken.Type];
    let leftExp = prefix();

    while (
      !this.peekTokenIs(TokenType.SEMICOLON) &&
      precedence < this.peekPrecedence()
    ) {
      if (!this.infixParseFns[this.peekToken.Type]) {
        return leftExp;
      }

      let infix = this.infixParseFns[this.peekToken.Type];

      this.nextToken();

      leftExp = infix(leftExp);
    }
    return leftExp;
  }

  parseIdentifier() {
    let ident = new Identifier(this.curToken, this.curToken.Literal);

    if (this.peekTokenIs(TokenType.INCREMENT)) {
      this.nextToken();
      return new IncrementExpression(this.curToken, ident, false);
    } else if (this.peekTokenIs(TokenType.DECREMENT)) {
      this.nextToken();
      return new DecrementExpression(this.curToken, ident, false);
    }

    return ident;
  }

  parsePreIncrement() {
    this.nextToken();
    let ident = new Identifier(this.curToken, this.curToken.Literal);
    return new IncrementExpression(this.curToken, ident, true);
  }

  parsePreDecrement() {
    this.nextToken();
    let ident = new Identifier(this.curToken, this.curToken.Literal);
    return new DecrementExpression(this.curToken, ident, true);
  }

  parseComment() {
    this.comments.push(this.curToken.Literal);
    return new Comment(this.curToken, this.curToken.Literal);
  }

  formatError(t: Token, msg: string): string {
    return `${msg} at ${t.Position.String()}`;
  }

  parseIntegerLiteral() {
    let value;
    let lit;
    try {
      value = parseInt(this.curToken.Literal, 10);
      lit = new IntegerLiteral(this.curToken, value);
    } catch (e) {
      let msg = this.formatError(
        this.curToken,
        `could not parse ${this.curToken.Literal} as integer`
      );
      this.errors.push(msg);
      return null;
    }

    if (this.peekTokenIs(TokenType.RANGE)) {
      this.nextToken();

      if (this.peekTokenIs(TokenType.LT_INT)) {
        this.nextToken();

        let rightValue = parseInt(this.curToken.Literal, 10);
        let right = new IntegerLiteral(this.curToken, rightValue);

        return new RangeLiteral(lit, TokenType.RANGE, right);
      } else {
        let msg = this.formatError(
          this.curToken,
          `invalid right value for RANGE ${this.curToken.Literal} as integer`
        );
        this.errors.push(msg);
        return null;
      }
    } else if (this.peekTokenIs(TokenType.RANGE_INCL)) {
      this.nextToken();

      if (this.peekTokenIs(TokenType.LT_INT)) {
        this.nextToken();

        let rightValue = parseInt(this.curToken.Literal, 10);
        let right = new IntegerLiteral(this.curToken, rightValue);
        return new RangeLiteral(lit, TokenType.RANGE_INCL, right);
      } else {
        let msg = this.formatError(
          this.curToken,
          `invalid right value for RANGE ${this.curToken.Literal} as integer`
        );
        this.errors.push(msg);
        return null;
      }
    }

    return lit;
  }

  parseFloatLiteral() {
    try {
      let value = parseFloat(this.curToken.Literal);
      let lit = new FloatLiteral(this.curToken, value);
      return lit;
    } catch (e) {
      let msg = this.formatError(
        this.curToken,
        `could not parse ${this.curToken.Literal} as float`
      );
      this.errors.push(msg);
      return null;
    }
  }

  parseStringLiteral() {
    return new StringLiteral(this.curToken, this.curToken.Literal);
  }

  curTokenIs(t: TokenTypeName) {
    return this.curToken.Type === t;
  }

  peekTokenIs(t: TokenTypeName) {
    return this.peekToken.Type === t;
  }
  // peekTokenIs is a helper function that returns true if the next token is of the given type
  expectPeek(t: TokenTypeName) {
    if (this.peekTokenIs(t)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(t);
      return false;
    }
  }

  peekError(t: TokenTypeName): void {
    if (this.peekToken === null) return;

    let msg = this.formatError(
      this.peekToken,
      `expected next token to be ${t}, got ${this.peekToken.Type} instead`
    );
    this.errors.push(msg);
  }

  registerPrefix(tokenType: TokenTypeName, fn: Function) {
    this.prefixParseFns[tokenType] = fn;
  }

  registerInfix(tokenType: TokenTypeName, fn: Function) {
    this.infixParseFns[tokenType] = fn;
  }

  noPrefixParseFnError(t: Token) {
    let msg = this.formatError(
      t,
      `no prefix parse function for ${t.Type} found: ${t.Literal}`
    );
    this.errors.push(msg);
  }

  parsePrefixExpression() {
    let curToken = this.curToken;
    let curLiteral = this.curToken.Literal;

    this.nextToken();

    return new PrefixExpression(
      curToken,
      curLiteral,
      this.parseExpression(Precedence.PREFIX)
    );
  }

  peekPrecedence() {
    if (this.peekToken === null) {
      return Precedence.LOWEST;
    }

    if (precedences[this.peekToken.Type]) {
      return precedences[this.peekToken.Type];
    }
    return Precedence.LOWEST;
  }

  curPrecedence() {
    if (precedences[this.curToken.Type]) {
      return precedences[this.curToken.Type];
    }
    return Precedence.LOWEST;
  }

  parseInfixExpression(left: Expression) {
    let curToken = this.curToken;
    let curLiteral = this.curToken.Literal;

    let precedence = this.curPrecedence();
    this.nextToken();

    return new InfixExpression(
      curToken,
      left,
      curLiteral,
      this.parseExpression(precedence)
    );
  }

  parseBoolean() {
    return new AstBoolean(this.curToken, this.curTokenIs(TokenType.TRUE));
  }

  parseGroupedExpression() {
    this.nextToken();

    let exp = this.parseExpression(Precedence.LOWEST);

    if (!this.expectPeek(TokenType.RPAREN)) {
      return null;
    }

    return exp;
  }
  // parseNull parses a null keyword
  parseNull() {
    return new NullLiteral(this.curToken);
  }
  parseIfExpression() {
    let curToken = this.curToken;

    if (!this.expectPeek(TokenType.LPAREN)) {
      return null;
    }

    this.nextToken();
    let Condition = this.parseExpression(Precedence.LOWEST);

    if (!this.expectPeek(TokenType.RPAREN)) {
      return null;
    }

    if (!this.expectPeek(TokenType.LBRACE)) {
      return null;
    }

    let Consequence = this.parseBlockStatement();

    let Alternative = null;
    if (this.peekTokenIs(TokenType.ELSE)) {
      this.nextToken();

      if (!this.expectPeek(TokenType.LBRACE)) {
        return null;
      }

      Alternative = this.parseBlockStatement();
    }

    return new IfExpression(curToken, Condition, Consequence, Alternative);
  }

  parseBlockStatement() {
    let block = new BlockStatement(this.curToken);

    this.nextToken();

    while (
      !this.curTokenIs(TokenType.RBRACE) &&
      !this.curTokenIs(TokenType.EOF)
    ) {
      let stmt = this.parseStatement();
      if (stmt !== null) {
        block.Statements.push(stmt);
      }
      this.nextToken();
    }

    return block;
  }

  // import("filename.monkey")
  // import("filename.monkey") as testing
  parseImportSpec() {
    let curToken = this.curToken;

    if (!this.expectPeek(TokenType.LPAREN)) {
      return null;
    }

    this.nextToken();
    let path = this.parseStringLiteral();

    if (!this.expectPeek(TokenType.RPAREN)) {
      return null;
    }

    let ident = null;
    if (this.peekTokenIs(TokenType.AS)) {
      this.nextToken();
      this.nextToken();
      ident = new Identifier(this.curToken, this.curToken.Literal);
    }

    return new ImportSpec(curToken, path, ident);
  }

  parseFunctionLiteral() {
    let curToken = this.curToken;
    if (!this.expectPeek(TokenType.LPAREN)) {
      return null;
    }

    let Parameters = this.parseFunctionParameters();

    if (!this.expectPeek(TokenType.LBRACE)) {
      return null;
    }

    let Body = this.parseBlockStatement();

    return new FunctionLiteral(curToken, Parameters, Body);
  }

  parseWhileLiteral() {
    let curToken = this.curToken;

    if (!this.expectPeek(TokenType.LPAREN)) {
      return null;
    }

    let Expression = this.parseExpression(Precedence.LOWEST);

    if (!this.expectPeek(TokenType.LBRACE)) {
      return null;
    }

    let Body = this.parseBlockStatement();

    return new WhileLiteral(curToken, Expression, Body);
  }

  parseForLiteral() {
    let curToken = this.curToken;

    if (!this.expectPeek(TokenType.LPAREN)) {
      return null;
    }

    this.nextToken();
    let Initiate = this.parseVarStatement();

    if (Initiate === null) {
      return null;
    }

    this.nextToken();
    let Check = this.parseExpressionStatement();

    this.nextToken();
    let Iterate = this.parseVarStatement();

    if (
      Iterate === null ||
      !this.expectPeek(TokenType.RPAREN) ||
      !this.expectPeek(TokenType.LBRACE)
    ) {
      return null;
    }

    let Body = this.parseBlockStatement();

    return new ForLiteral(curToken, Initiate, Check, Iterate, Body);
  }

  parseFunctionParameters(): Identifier[] {
    let identifiers: Identifier[] = [];

    if (this.peekTokenIs(TokenType.RPAREN)) {
      this.nextToken();
      return identifiers;
    }

    this.nextToken();

    let ident = new Identifier(this.curToken, this.curToken.Literal);
    identifiers.push(ident);

    while (this.peekTokenIs(TokenType.COMMA)) {
      this.nextToken();
      this.nextToken();

      ident = new Identifier(this.curToken, this.curToken.Literal);
      identifiers.push(ident);
    }

    if (!this.expectPeek(TokenType.RPAREN)) {
      return [];
    }

    return identifiers;
  }

  parseCallExpression(func: Expression) {
    return new CallExpression(
      this.curToken,
      func,
      this.parseExpressionList(TokenType.RPAREN)
    );
  }

  parseArrayLiteral(): Expression {
    return new ArrayLiteral(
      this.curToken,
      this.parseExpressionList(TokenType.RBRACKET)
    );
  }

  parseExpressionList(end: TokenTypeName): Expression[] {
    let list: Expression[] = [];

    if (this.peekTokenIs(end)) {
      this.nextToken();
      return list;
    }

    this.nextToken();
    list.push(this.parseExpression(Precedence.LOWEST));

    while (this.peekTokenIs(TokenType.COMMA)) {
      this.nextToken();
      this.nextToken();
      list.push(this.parseExpression(Precedence.LOWEST));
    }

    if (!this.expectPeek(end)) {
      return [];
    }

    return list;
  }

  // [1], [1:], [:1]
  // 'abcd'[1] => 'b'
  // 'abcd'[:2] => 'ab'
  // 'abcd'[1:3] => 'bc'
  // 'abcd'[2:] => 'cd'
  // ['a', 'b', 'c', 'd'][:2]
  parseIndexExpression(left: Expression): IndexExpression | null {
    let curToken = this.curToken;

    this.nextToken();

    let exp = new IndexExpression(curToken, left);

    // [1?]
    if (!this.curTokenIs(TokenType.COLON)) {
      exp.Index = this.parseExpression(Precedence.LOWEST);
      this.nextToken();
    }

    // [?:]
    if (this.curTokenIs(TokenType.COLON)) {
      this.nextToken();
      exp.HasColon = true;
    }

    // // [?1]
    if (!this.curTokenIs(TokenType.RBRACKET)) {
      exp.RightIndex = this.parseExpression(Precedence.LOWEST);
      this.nextToken();
    }

    if (!this.curTokenIs(TokenType.RBRACKET)) {
      return null;
    }

    return exp;
  }

  parseHashLiteral(): Expression | null {
    let hash = new HashLiteral(this.curToken, new Map());

    while (!this.peekTokenIs(TokenType.RBRACE)) {
      this.nextToken();
      let key = this.parseExpression(Precedence.LOWEST);

      if (!this.expectPeek(TokenType.COLON)) {
        return null;
      }

      this.nextToken();
      let value = this.parseExpression(Precedence.LOWEST);

      hash.Pairs.set(key, value);

      if (
        !this.peekTokenIs(TokenType.RBRACE) &&
        !this.expectPeek(TokenType.COMMA)
      ) {
        return null;
      }
    }

    if (!this.expectPeek(TokenType.RBRACE)) {
      return null;
    }

    return hash;
  }
  // parseSwitchStatement handles a switch statement
  // e.g. switch (x) {
  //   case 1:
  //     return 1;
  //   case 2:
  //     return 2;
  //   default:
  //     return 3;
  // }
  // A switch-statement should only have one default block
  parseSwitchStatement(): SwitchExpression | null {
    let curToken = this.curToken;

    if (!this.expectPeek(TokenType.LPAREN)) {
      return null;
    }

    this.nextToken();
    let Expression = this.parseExpression(Precedence.LOWEST);

    if (!this.expectPeek(TokenType.RPAREN)) {
      return null;
    }

    if (!this.expectPeek(TokenType.LBRACE)) {
      return null;
    }

    let Cases: CaseExpression[] = [];
    this.nextToken();

    while (!this.curTokenIs(TokenType.RBRACE)) {
      let Case = this.parseCase();
      if (Case === null) {
        return null;
      }
      Cases.push(Case);
    }

    if (!this.expectPeek(TokenType.RBRACE)) {
      return null;
    }

    return new SwitchExpression(curToken, Expression, Cases);
  }
  // parseCase
  // check if it is case or default

  parseCase(): CaseExpression | null {
    let curToken = this.curToken;

    if (!this.expectPeek(TokenType.CASE)) {
      return null;
    }

    this.nextToken();
    let Expression = this.parseExpression(Precedence.LOWEST);

    if (!this.expectPeek(TokenType.COLON)) {
      return null;
    }

    this.nextToken();
    let Body = this.parseBlockStatement();

    return new CaseExpression(curToken, Expression, false, Body);
  }
  // ENUM Identifier LBRACE Identifier (COMMA Identifier)* RBRACE
  parseEnumStatement(): EnumLiteral | null {
    let curToken = this.curToken;
    this.nextToken();
    let name = this.parseIdentifier() as Identifier;
    if (!this.expectPeek(TokenType.LBRACE)) {
      return null;
    }

    let Enum: EnumLiteral = new EnumLiteral(curToken, name, []);
    while (!this.curTokenIs(TokenType.RBRACE)) {
      if (this.curTokenIs(TokenType.IDENT)) {
        let id = this.parseEnumElement();
        if (id != null) {
          Enum.Values.push(id);
        }
        this.nextToken();
      } else if (TokenType.COMMA) {
        this.nextToken();
      } else {
        this.nextToken();
      }
    }

    return Enum;
  }
  // enum element
  // enum element have a name and a optional value
  // e.g.
  // enum Color { Red, Green, Blue }
  // enum Color { Red = 1, Green, Blue }
  parseEnumElement(): EnumElement | null {
    let curToken = this.curToken;
    let name = this.parseIdentifier() as Identifier;

    if (this.curTokenIs(TokenType.ASSIGN)) {
      this.nextToken();
      let value = this.parseExpression(Precedence.LOWEST);
      return new EnumElement(curToken, name, value);
    } else {
      return new EnumElement(curToken, name, name);
    }
  }

  //isEnum
  // any identifier that is not a reserved word
  // then { Identifier (COMMA Identifier)* }
  // e.g. enum Color { Red, Green, Blue }
  // enum Color { Red = 1, Green, Blue }
  isEnum(): boolean {
    return (
      this.curTokenIs(TokenType.IDENT) && this.peekTokenIs(TokenType.LBRACE)
    );
  }

  // parse type declaration
  // e.g. Ident := Type;
  // e.g. SomeThing := string | number;
  // e.g. Status := "active" | "inactive";
  // e.g. Color := "red" | "green" | "blue";
  // e.g. Nums = 1 | 2 | 3;
  parseTypeDeclaration(): UnionTypeAST | null {
    // except identifier
    let curToken = this.curToken;
    let name = this.parseIdentifier() as Identifier;
    // expect :=
    this.nextToken();
    this.nextToken();
    var result = new UnionTypeAST(curToken, name, []);

    while (!this.curTokenIs(TokenType.SEMICOLON)) {
      if (
        this.curTokenIs(TokenType.IDENT) ||
        this.curTokenIs(TokenType.LT_STRING) ||
        this.curTokenIs(TokenType.LI_FLOAT) ||
        this.curTokenIs(TokenType.LT_INT)
      ) {
        let id = this.parseType();
        if (id !== null) {
          result.Members.push(id);
        }
        this.nextToken();
      } else if (this.curTokenIs(TokenType.BIT_OR)) {
        this.nextToken();
      } else {
        this.nextToken();
      }
    }
    return result;
  }

  parseType(): Expression | null {
    // e.g. string | number
    // or e.g. "active" | "inactive"
    // or e.g. "red" | "green" | "blue"
    // or e.g. 1 | 2 | 3
    let curToken = this.curToken;
    if (this.curTokenIs(TokenType.IDENT)) {
      return this.parseIdentifier();
    } else if (this.curTokenIs(TokenType.LT_STRING)) {
      return this.parseStringLiteral();
    } else if (
      this.curTokenIs(TokenType.LT_INT) || // FLOAT
      this.curTokenIs(TokenType.LI_FLOAT)
    ) {
      return this.parseExpression(Precedence.LOWEST);
    } else {
      return null;
    }
  }
  // parse interface
  // Identifier LBRACE (Identifier (COMMA Identifier)*)? RBRACE
  // e.g. SomeInterface { a: string, b: number };
  parseInterface(): InterfaceAST | null {
    let curToken = this.curToken;
    this.nextToken();
    let name = this.parseIdentifier() as Identifier;
    if (!this.expectPeek(TokenType.LBRACE)) {
      return null;
    }
    this.nextToken();

    var result: InterfaceAST = new InterfaceAST(curToken, name, []);
    while (!this.curTokenIs(TokenType.RBRACE)) {
      // expect identifier identifier
      let id = this.parseInterfaceType();
      if (id != null) {
        result.Members.push(id);
      } else if (this.curTokenIs(TokenType.SEMICOLON)) {
        this.nextToken();
      } else {
        this.nextToken();
      }
    }
    return result;
  }
  // parseInterfaceType
  // e.g. name String ;
  // e.g. age Int ;
  parseInterfaceType(): InterfaceMember | null {
    let curToken = this.curToken;
    let name = this.parseIdentifier() as Identifier;

    this.nextToken();
    let type = this.parseType();
    if (type != null) {
      return new InterfaceMember(curToken, name, type);
    }

    return null;
  }

  // annotation
  // @Identifier
  // e.g. @SomeAnnotation
  isAnnotation(): boolean {
    return this.curTokenIs(TokenType.AT) && this.peekTokenIs(TokenType.IDENT);
  }
  parseAnnotation(): AnnotationAST | null {
    let curToken = this.curToken;
    this.nextToken();
    let name = this.parseIdentifier() as Identifier;
    this.nextToken();
    // annotation can have value
    // e.g. @SomeAnnotation(value)
    if (this.curTokenIs(TokenType.LPAREN)) {
      this.nextToken();
      let value = this.parseExpression(Precedence.LOWEST);
      this.nextToken();
      return new AnnotationAST(curToken, name, value);
    }
    return new AnnotationAST(curToken, name, null);
  }
}
