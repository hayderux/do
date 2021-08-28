import 'dart:io';
import 'package:dolang/ast/ast_node.dart';
import 'package:dolang/lexer/lexer.dart';
import 'package:dolang/parser/parser.dart';
import 'package:test/test.dart' as test;

void main() {
  test.test("Parser doesn't crash" , () {
    final Lexer lexer = Lexer(
        File('./test/TestPrograms/test_parser.birb').readAsStringSync());
    final ASTNode ast = Parser(lexer).parse();

    test.expect(ast.type, test.equals(ASTType.AST_COMPOUND));
  });
}
