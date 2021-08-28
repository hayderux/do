import '../runtime/runtime.dart';
import '../ast/ast_node.dart';
import '../ast/ast_types.dart';
import '../utils/exceptions.dart';

/// Visits properties for `Int`s
ASTNode visitIntProperties(ASTNode node, ASTNode left) {
  switch (node.binaryOpRight.variableName) {
    case 'bitLength':
      {
        final IntNode intAST = IntNode()..intVal = left.intVal.bitLength;
        return intAST;
      }

    case 'isEven':
      {
        final BoolNode boolAST = BoolNode()..boolVal = left.intVal.isEven;
        return boolAST;
      }

    case 'isFinite':
      {
        final BoolNode boolAST = BoolNode()..boolVal = left.intVal.isFinite;
        return boolAST;
      }

    case 'isInfinite':
      {
        final BoolNode boolAST = BoolNode()..boolVal = left.intVal.isInfinite;
        return boolAST;
      }

    case 'isNaN':
      {
        final BoolNode boolAST = BoolNode()..boolVal = left.intVal.isNaN;
        return boolAST;
      }

    case 'isNegative':
      {
        final BoolNode boolAST = BoolNode()..boolVal = left.intVal.isNegative;
        return boolAST;
      }

    case 'isOdd':
      {
        final BoolNode boolAST = BoolNode()..boolVal = left.intVal.isOdd;
        return boolAST;
      }

    case 'sign':
      {
        final IntNode intAST = IntNode()..intVal = left.intVal.sign;
        return intAST;
      }

    case 'runtimeType':
      {
        final StringNode stringAST = StringNode()
          ..stringValue = left.intVal.runtimeType.toString();
        return stringAST;
      }

    default:
      throw NoSuchPropertyException(node.binaryOpRight.variableName, 'int');
  }
}

/// Visits methods for `Int`s
ASTNode visitIntMethods(ASTNode node, ASTNode left) {
  switch (node.binaryOpRight.funcCallExpression.variableName) {
    case 'abs':
        return IntNode()..intVal = left.intVal.abs();

    case 'clamp':
        expectArgs(node.binaryOpRight.functionCallArgs, [IntNode, IntNode]);

        final List<ASTNode> args = node.binaryOpRight.functionCallArgs;

       return IntNode()
          ..intVal = left.intVal.clamp(args[0].intVal, args[1].intVal).toInt();

    case 'compareTo':
        expectArgs(node.binaryOpRight.functionCallArgs, [IntNode]);

        return IntNode()
          ..intVal =
              left.intVal.compareTo(node.binaryOpRight.functionCallArgs[0].intVal);

    case 'gcd':
        expectArgs(node.binaryOpRight.functionCallArgs, [IntNode]);

        return IntNode()
          ..intVal = left.intVal.gcd(node.binaryOpRight.functionCallArgs[0].intVal);

    case 'modInverse':
        expectArgs(node.binaryOpRight.functionCallArgs, [IntNode]);
        final IntNode intAST = IntNode()
          ..intVal =
              left.intVal.modInverse(node.binaryOpRight.functionCallArgs[0].intVal);
        return intAST;

    case 'modPow':
        expectArgs(node.binaryOpRight.functionCallArgs, [IntNode, IntNode]);
        final List<ASTNode> args = node.binaryOpRight.functionCallArgs;
        final IntNode intAST = IntNode()
          ..intVal = left.intVal.modPow(args[0].intVal, args[1].intVal);
        return intAST;

    case 'remainder':
        expectArgs(node.binaryOpRight.functionCallArgs, [IntNode]);
        final IntNode intAST = IntNode()
          ..intVal =
              left.intVal.remainder(node.binaryOpRight.functionCallArgs[0].intVal).toInt();
        return intAST;

    case 'toDouble':
        final DoubleNode doubleAST = DoubleNode()..doubleVal = left.intVal.toDouble();
        return doubleAST;

    case 'toRadixString':
        expectArgs(node.binaryOpRight.functionCallArgs, [IntNode]);
        final StringNode stringAST = StringNode()
          ..stringValue = left.intVal
              .toRadixString(node.binaryOpRight.functionCallArgs[0].intVal);
        return stringAST;

    case 'toSigned':
        expectArgs(node.binaryOpRight.functionCallArgs, [IntNode]);
        final IntNode intAST = IntNode()
          ..intVal =
              left.intVal.toSigned(node.binaryOpRight.functionCallArgs[0].intVal);
        return intAST;

    case 'toString':
        final StringNode stringAST = StringNode()
          ..stringValue = left.intVal.toString();
        return stringAST;

    case 'toStringAsExponential':
        final List<ASTNode> args = node.binaryOpRight.functionCallArgs;
        final StringNode stringAST = StringNode()
          ..stringValue = left.intVal
              .toStringAsExponential(args.isEmpty ? 0 : args[0].intVal);
        return stringAST;

    case 'toStringAsFixed':
        expectArgs(node.binaryOpRight.functionCallArgs, [IntNode]);
        final StringNode stringAST = StringNode()
          ..stringValue = left.intVal
              .toStringAsFixed(node.binaryOpRight.functionCallArgs[0].intVal);
        return stringAST;

    case 'toStringAsPrecision':
        expectArgs(node.binaryOpRight.functionCallArgs, [IntNode]);
        final StringNode stringAST = StringNode()
          ..stringValue = left.intVal
              .toStringAsPrecision(node.binaryOpRight.functionCallArgs[0].intVal);
        return stringAST;

    case 'toUnsigned':
        expectArgs(node.binaryOpRight.functionCallArgs, [IntNode]);
        final IntNode intAST = IntNode()
          ..intVal =
              left.intVal.toUnsigned(node.binaryOpRight.functionCallArgs[0].intVal);
        return intAST;

    default:
      throw NoSuchMethodException(
          node.binaryOpRight.funcCallExpression.variableName, 'int');
  }
}