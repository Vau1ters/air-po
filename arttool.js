const fs = require("fs");

fs.readdir("./res/image", (err, imgs) => {
  if (!imgs) {
    console.log(err);
  }
  imgs.forEach((img) => {});
});

const a = fs.readFileSync("./src/core/graphics/art.ts", { encoding: "utf-8" });
const b = a.split("\n");
const c = b.filter((line) => {
  const reg = /^(?!.*import).*$/g;
  const result = line.match(reg);
  return result !== null;
});
console.log(c);
