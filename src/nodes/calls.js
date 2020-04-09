const { concat, group, indent, softline } = require("../prettier");
const { concatBody, first, makeCall } = require("../utils");

const noIndent = ["array", "hash", "if", "method_add_block", "xstring_literal"];

module.exports = {
  call: (path, opts, print) => {
    const receiver = path.call(print, "body", 0);
    const operator = makeCall(path, opts, print);
    let name = path.getValue().body[2];

    // You can call lambdas with a special syntax that looks like func.(*args).
    // In this case, "call" is returned for the 3rd child node.
    if (name !== "call") {
      name = path.call(print, "body", 2);
    }

    // For certain left sides of the call nodes, we want to attach directly to
    // the } or end.
    if (noIndent.includes(path.getValue().body[0].type)) {
      return concat([receiver, operator, name]);
    }

    return group(
      concat([receiver, group(indent(concat([softline, operator, name])))])
    );
  },
  fcall: concatBody,
  method_add_arg: (path, opts, print) => {
    const [method, args] = path.map(print, "body");
    const argNode = path.getValue().body[1];

    // This case will ONLY be hit if we can successfully turn the block into a
    // to_proc call. In that case, we just explicitly add the parens around it.
    if (argNode.type === "args" && args.length > 0) {
      return concat([method, "("].concat(args).concat(")"));
    }

    return concat([method, args]);
  },
  method_add_block: concatBody,
  vcall: first
};
