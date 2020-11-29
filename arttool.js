const fs = require("fs");

const arttsPath = "./src/core/graphics/art.ts";
const arttsPath2 = "./src/core/graphics/output.ts";

function deleteImportLine(lines) {
  return lines.filter((line) => {
    const nonMatchedImportLine = line.match(/^(?!.*import).*$/g);
    const matchedPixiImportLine = line.match(/pixi/g);
    return nonMatchedImportLine !== null || matchedPixiImportLine !== null;
  });
}
function deleteTextureStoreLine(lines) {
  return lines.filter((line) => {
    const matchedTexutureStoreLine = line.match(/textureStore/g);
    const matchedAwaitLine = line.match(/await/g);
    const a = matchedTexutureStoreLine !== null && matchedAwaitLine !== null;
    return !a;
  });
}

function genTextureStoreLine(file, isSingleImage) {
  const filename = file.split(".")[0];
  const a = isSingleImage
    ? filename + "Img"
    : filename + "Img, " + filename + "Setting";

  const f = isSingleImage ? "buildSingleTexture" : "buildAnimationTexture";
  //like this↓
  //textureStore.title = await buildSingleTexture(titleImg)
  //textureStore.player = await buildAnimationTexture(playerImg, playerSetting)
  return "textureStore." + filename + "= await " + f + "(" + a + ")";
}
function genImportLine(file) {
  const filename = file.split(".")[0];
  const ext = file.split(".")[1];
  const prefix = ext == "png" ? "Img" : "Setting";

  const objname = filename + prefix;
  const dirname = ext == "png" ? "@res/image/" : "@res/map/";

  return "import " + objname + " from " + "'" + dirname + file + "'";
}

fs.readFile(arttsPath, "utf-8", (err, fileData) => {
  const fileDataLines = fileData.split("\n");
  const fileDataLinesExceptImport = deleteImportLine(fileDataLines);
  const fileDataLinesExceptTextureStore = deleteTextureStoreLine(
    fileDataLinesExceptImport
  );
  let r = fileDataLinesExceptTextureStore;
  // entry
  fs.readdir("./res/image", (err, imgs) => {
    imgs.forEach((img) => {
      r = [genImportLine(img)].concat(r);
    });
    const maps = fs.readdirSync("./res/map");
    const mapFileNames = maps.map((e) => {
      return e.split(".")[0];
    });
    const SingleTextures = imgs.filter((img) => {
      const imgFileName = img.split(".")[0];
      return mapFileNames.indexOf(imgFileName) !== -1;
    });
    imgs.forEach((img) => {
      isSingleImage = SingleTextures.indexOf(img);
      r = r.concat([genTextureStoreLine(img, isSingleImage)]);
    });
    console.log(r);

    const fileString = r.reduce((a, c) => {
      return a + c + "\n";
    }, "");
    fs.writeFileSync(arttsPath2, fileString);
  });
});
