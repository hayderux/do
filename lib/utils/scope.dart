import 'dart:collection';

import '../ast/ast_node.dart';

class Scope {

  Scope(this.global) {
    variableDefinitions = ListQueue();
    functionDefinitions = ListQueue();
  }

  ASTNode owner;
  ListQueue<ASTNode> variableDefinitions;
  ListQueue<ASTNode> functionDefinitions;
  bool global;

  Scope copy() {
    final Scope scope = Scope(global);

    for (var element in variableDefinitions) {
      scope.variableDefinitions.add(element.copy());
    }

    for (var element in functionDefinitions) {
      scope.functionDefinitions.add(element.copy());
    }

    return scope;
  }
}
