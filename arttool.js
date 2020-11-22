const fs = require("fs");

function genImportLine(file) {
  const filename = file.split(".")[0];
  const ext = file.split(".")[1];
  const prefix = ext == "png" ? "Img" : "Setting";

  const objname = filename + prefix;
  const dirname = ext == "png" ? "@res/image/" : "@res/map/";

  return "import " + objname + " from " + dirname + file;
}

fs.readdir("./res/image", (err, imgs) => {
  if (!imgs) {
    console.log(err);
  }
  imgs.forEach((img) => {
    console.log(genImportLine(img));
  });
});

const a = fs.readFileSync("./src/core/graphics/art.ts", { encoding: "utf-8" });
const b = a.split("\n");
const c = b.filter((line) => {
  const reg = /^(?!.*import).*$/g;
  const result = line.match(reg);
  return result !== null;
});
console.log(c);
