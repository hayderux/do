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

export enum TokenType {
  ILLEGAL = "ILLEGAL",
  EOF = "EOF",
  COMMENT = "COMMENT",

  // Identifiers + literals
  IDENT = "IDENT", // add, foobar, x, y, ...
  LT_INT = "LITERAL_INT", // 1343456
  LI_FLOAT = "LITERAL_FLOAT", // 123.456
  LT_STRING = "LITERAL_STRING", // "foo", "Hello, World!"

  LBRACKET = "[", // for arrays
  RBRACKET = "]",

  INCREMENT = "++",
  DECREMENT = "--",

  // Operators
  ASSIGN = "=",
  COLONEQ = ":=",
  PLUS = "+",
  MINUS = "-",
  BANG = "!",
  ASTERISK = "*",
  EXPONENT = "**",
  SLASH = "/",
  REM = "%",
  LT = "<",
  GT = ">",
  LTE = "<=",
  GTE = ">=",
  EQ = "==",
  NOT_EQ = "!=",
  RANGE = "..",
  RANGE_INCL = "...",

  // Bitwise
  BIT_AND = "&",
  BIT_OR = "|",
  BIT_XOR = "^",
  BIT_NOT = "~",
  BIT_LSHIFT = "<<",
  BIT_RSHIFT = ">>",
  BIT_ZRSHIFT = ">>>",

  // Delimiters
  COMMA = ",",
  PERIOD = ".",
  COLON = ":",
  SEMICOLON = ";",
  LPAREN = "(",
  RPAREN = ")",
  LBRACE = "{",
  RBRACE = "}",
  AT = "@",
  // hash
  HASH = "#",
  // underscore
  UNDERSCORE = "_",

  // Keywords
  LAND = "AND",
  LOR = "OR",
  AS = "AS",
  IS = "IS",
  SWITCH = "SWITCH",
  CASE = "CASE",
  DEFAULT = "DEFAULT",
  IMPORT = "IMPORT",
  FUNCTION = "FUNCTION",
  WHILE = "WHILE",
  TRY = "TRY",
  CATCH = "CATCH",
  FOR = "FOR",
  CONST = "CONST",
  TRUE = "TRUE",
  FALSE = "FALSE",
  IF = "IF",
  ELSE = "ELSE",
  RETURN = "RETURN",
  THIS = "THIS",
  ASSERT = "ASSERT",
  NULL = "nil",
  // advanced
  MEMORY = "MEMORY",
  EXTENSTION = "EXTENSTION",
  // types
  INT = "INT",
  FLOAT = "FLOAT",
  STRING = "STRING",
  BOOL = "BOOL",
  VOID = "VOID",
  ARRAY = "ARRAY",
  TUPLE = "TUPLE",
  OBJECT = "OBJECT",
  ANY = "ANY",
  // model aka interface
  MODEL = "MODEL",
  // enum
  ENUM = "ENUM",
  // type
  TYPE = "TYPE",
  //VAR
  VAR = "VAR",
}
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
  nil: TokenType.NULL,
  try: TokenType.TRY,
  catch: TokenType.CATCH,
  //types
  any: TokenType.ANY,
  int: TokenType.INT,
  float: TokenType.FLOAT,
  string: TokenType.STRING,
  bool: TokenType.BOOL,
  void: TokenType.VOID,
  array: TokenType.ARRAY,
  tuple: TokenType.TUPLE,
  object: TokenType.OBJECT,
  // model aka interface
  model: TokenType.MODEL,
  //
  enum: TokenType.ENUM,
  // type
  type: TokenType.TYPE,
  // var
  var: TokenType.VAR,
};

export function LookupIdent(ident: string): string {
  if (Keywords[ident]) return Keywords[ident];
  return TokenType.IDENT;
}
