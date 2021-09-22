import llvm from "llvm-node";
import {
  AstBoolean,
  FloatLiteral,
  IntegerLiteral,
  NodeKind,
  StringLiteral,
} from "../ast/ast";
import { LLVMGenerator } from "./gen/generator";

export function getLLVMType(
  type: NodeKind,
  generator: LLVMGenerator
): llvm.Type {
  if (type instanceof AstBoolean) {
    const { context } = generator;

    return llvm.Type.getInt1Ty(context);
  } else if (type instanceof IntegerLiteral) {
    return llvm.Type.getInt32Ty(generator.context);
  } else if (type instanceof FloatLiteral) {
    return llvm.Type.getDoubleTy(generator.context);
  } else if (type instanceof StringLiteral) {
    return llvm.Type.getInt8PtrTy(generator.context);
  } else {
    throw new Error("Unknown type");
  }
}
