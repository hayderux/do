import llvm from "llvm-node";
import { Node } from "../../ast/ast";

export class LLVMGenerator {
  module: llvm.Module;
  context: llvm.LLVMContext;
  builder: llvm.IRBuilder;

  constructor(module: llvm.Module, context: llvm.LLVMContext) {
    this.module = module;
    this.context = context;
    this.builder = new llvm.IRBuilder(context);
  }
  // emit node
  emitNode(node: Node) {}
}

export function emitLLVM() {
  const context = new llvm.LLVMContext();
  const module = new llvm.Module("main", context);
  const generator = new LLVMGenerator(module, context);
  const { builder } = generator;
  return module;
}
