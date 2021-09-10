import fs from "fs";
import Environment from "../../object/environment";
import OObject, { Builtin, OString, STRING_OBJ } from "../../object/object";
import { newError, NULL } from "../evaluator";

// reads a file as a string
// file_read('README.md')
// file_read('example.monkey')
export default new Builtin(function (
  env: Environment,
  ...args: OObject[]
): OObject {
  if (args.length !== 1) {
    return newError("wrong number of arguments. got=%s, want=1", args.length);
  }

  if (args[0].Type() !== STRING_OBJ) {
    return newError(
      "argument to `file_read` must be STRING, got %s",
      args[0].Type()
    );
  }

  let path = args[0].Inspect();

  let content = fs.readFileSync(path, "utf8");
  if (!content) return NULL;

  return new OString(content);
});
