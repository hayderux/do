import 'dart:io';

import '../lexer/lexer.dart';
import '../parser/parser.dart';
import '../runtime/runtime.dart';
import '../runtime/standards.dart';
import '../ast/ast_node.dart';
import '../ast/ast_types.dart';
import '../utils/scope.dart';

void registerIO(Runtime runtime) {
  runtime.registerGlobalFunction('exit', funcExit);
  runtime.registerGlobalFunction('free', funcFree);
  runtime.registerGlobalFutureFunction('execute', funcExecute);
}

Future<ASTNode> funcExecute(
    Runtime runtime, ASTNode self, List<ASTNode> args) async {
  expectArgs(args, [StringNode]);

  final ASTNode node = Parser(Lexer(args[0].stringValue)).parse();
  await runtime.visit(node);

  return AnyNode();
}

ASTNode funcExit(Runtime runtime, ASTNode self, List<ASTNode> args) {
  expectArgs(args, [IntNode]);

  final exitAST = args[0];

  exit(exitAST.intVal);

  return INITIALIZED_NOOP; // ignore: dead_code
}

ASTNode funcFree(Runtime runtime, ASTNode self, List<ASTNode> args) {
  final Scope scope = runtime.getScope(self);

  // ignore: avoid_function_literals_in_foreach_calls
  args.forEach((arg) {
    if (arg is! VariableNode) {
      return;
    }

    scope.variableDefinitions
        .removeWhere((varDef) => varDef.variableName == arg.variableName);
  });

  return INITIALIZED_NOOP;
}
