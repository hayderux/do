import Position from "./position";

export default class Token {
  Type: string;
  Literal: string;
  Position: Position;

  constructor(type: string, literal: string, position?: Position) {
    this.Type = type;
    this.Literal = literal;
    this.Position = position || new Position(0, 0, 0);
  }
}

export type TokenTypeName = string;

export const TokenType: { [index: string]: TokenTypeName } = {
  ILLEGAL: "ILLEGAL",
  EOF: "EOF",
  COMMENT: "COMMENT",

  // Identifiers + literals
  IDENT: "IDENT", // add, foobar, x, y, ...
  INT: "INT", // 1343456
  FLOAT: "FLOAT", // 123.456
  STRING: "STRING", // "foo", "Hello, World!"

  LBRACKET: "[", // for arrays
  RBRACKET: "]",

  INCREMENT: "++",
  DECREMENT: "--",

  // Operators
  ASSIGN: "=",
  PLUS: "+",
  MINUS: "-",
  BANG: "!",
  ASTERISK: "*",
  EXPONENT: "**",
  SLASH: "/",
  REM: "%",
  LT: "<",
  GT: ">",
  LTE: "<=",
  GTE: ">=",
  EQ: "==",
  NOT_EQ: "!=",
  RANGE: "..",
  RANGE_INCL: "...",

  // Bitwise
  BIT_AND: "&",
  BIT_OR: "|",
  BIT_XOR: "^",
  BIT_NOT: "~",
  BIT_LSHIFT: "<<",
  BIT_RSHIFT: ">>",
  BIT_ZRSHIFT: ">>>",

  // Delimiters
  COMMA: ",",
  PERIOD: ".",
  COLON: ":",
  SEMICOLON: ";",
  LPAREN: "(",
  RPAREN: ")",
  LBRACE: "{",
  RBRACE: "}",

  // Keywords
  LAND: "AND",
  LOR: "OR",
  AS: "AS",
  IS: "IS",
  SWITCH: "SWITCH",
  CASE: "CASE",
  DEFAULT: "DEFAULT",
  IMPORT: "IMPORT",
  FUNCTION: "FUNCTION",
  WHILE: "WHILE",
  TRY: "TRY",
  CATCH: "CATCH",
  FOR: "FOR",
  VAR: "VAR",
  CONST: "CONST",
  TRUE: "TRUE",
  FALSE: "FALSE",
  IF: "IF",
  ELSE: "ELSE",
  RETURN: "RETURN",
  THIS: "THIS",
  ASSERT: "ASSERT",
  NULL: "NULL",
  ENUM: "ENUM",
  class: "CLASS",
  INTERFACE: "INTERFACE",
  // advanced
  TASK: "TASK",
  ASYNC: "ASYNC",
  THREAD: "THREAD",
  MACRO: "MACRO",
  MEMORY: "MEMORY",
  TYPE: "TYPE",
  EXTENSTION: "EXTENSTION",
  // types
  INT_TYPE: "INT",
  FLOAT_TYPE: "FLOAT",
  STRING_TYPE: "STRING",
  BOOL_TYPE: "BOOL",
  VOID_TYPE: "VOID",
  ARRAY_TYPE: "ARRAY",
  TUPLE_TYPE: "TUPLE",
  OBJECT_TYPE: "OBJECT",
  ANY_TYPE: "ANY",
};
// keyword strings are defined here as the index
// for example, this is where a function is defined as "function"
export const Keywords: { [index: string]: string } = {
  switch: TokenType.SWITCH,
  case: TokenType.CASE,
  default: TokenType.DEFAULT,
  as: TokenType.AS,
  is: TokenType.IS,
  import: TokenType.IMPORT,
  function: TokenType.FUNCTION,
  while: TokenType.WHILE,
  for: TokenType.FOR,
  var: TokenType.VAR,
  const: TokenType.CONST,
  true: TokenType.TRUE,
  false: TokenType.FALSE,
  if: TokenType.IF,
  else: TokenType.ELSE,
  this: TokenType.THIS,
  return: TokenType.RETURN,
  and: TokenType.LAND,
  or: TokenType.LOR,
  assert: TokenType.ASSERT,
  null: TokenType.NULL,
  try: TokenType.TRY,
  catch: TokenType.CATCH,
  enum: TokenType.ENUM,
  class: TokenType.class,
  interface: TokenType.INTERFACE,
  //types
  any: TokenType.ANY_TYPE,
  int: TokenType.INT_TYPE,
  float: TokenType.FLOAT_TYPE,
  string: TokenType.STRING_TYPE,
  bool: TokenType.BOOL_TYPE,
  void: TokenType.VOID_TYPE,
  array: TokenType.ARRAY_TYPE,
  tuple: TokenType.TUPLE_TYPE,
  object: TokenType.OBJECT_TYPE,
};

export function LookupIdent(ident: string): string {
  if (Keywords[ident]) return Keywords[ident];
  return TokenType.IDENT;
}
