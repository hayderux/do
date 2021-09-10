import fs from "fs";
import Environment from "../../object/environment";
import OObject, { Builtin, STRING_OBJ } from "../../object/object";
import { newError, NULL } from "../evaluator";
import { json_parse } from "./json_parse";

// reads a json file
// file_read_json('package.json')['name']
export default new Builtin(function (
  env: Environment,
  ...args: OObject[]
): OObject {
  if (args.length !== 1) {
    return newError("wrong number of arguments. got=%s, want=1", args.length);
  }

  if (args[0].Type() !== STRING_OBJ) {
    return newError(
      "argument to `file_read_json` must be STRING, got %s",
      args[0].Type()
    );
  }

  let path = args[0].Inspect();

  let content = fs.readFileSync(path, "utf8");
  if (!content) return NULL;

  return json_parse(JSON.parse(content));
});
