function myAction(args) {
    const leftPad = require("left-pad")
    const lines = args.lines || [];
    console.log(lines)
    return { padded: lines.map(l => leftPad(l, 30, ".")) }
}

exports.main = myAction;
