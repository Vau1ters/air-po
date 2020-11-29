const fs = require("fs");

const arttsPath = "./src/core/graphics/art.ts";

function snakeToCamel(p) {
  //_+小文字を大文字にする(例:_a を A)
  return p.replace(/_./g, function(s) {
    return s.charAt(1).toUpperCase();
  });
}

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
  const filename = snakeToCamel(file.split(".")[0]);
  const a = isSingleImage
    ? filename + "Img"
    : filename + "Img, " + filename + "Setting";

  const f = isSingleImage ? "buildSingleTexture" : "buildAnimationTexture";
  //like this↓
  //textureStore.title = await buildSingleTexture(titleImg)
  //textureStore.player = await buildAnimationTexture(playerImg, playerSetting)
  return "  textureStore." + filename + " = await " + f + "(" + a + ")";
}
function genImportLine(file) {
  const filename = snakeToCamel(file.split(".")[0]);
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
    const maps = fs.readdirSync("./res/map");
    imgs.forEach((img) => {
      r = [genImportLine(img)].concat(r);
    });
    maps.forEach((m) => {
      r = [genImportLine(m)].concat(r);
    });
    const mapFileNames = maps.map((e) => {
      return e.split(".")[0];
    });
    const SingleTextures = imgs.filter((img) => {
      const imgFileName = img.split(".")[0];
      return mapFileNames.indexOf(imgFileName) == -1;
    });
    r[r.length - 2] = "";
    imgs.forEach((img) => {
      isSingleImage = SingleTextures.indexOf(img) !== -1;
      r = r.concat([genTextureStoreLine(img, isSingleImage)]);
    });
    r = r.concat(["}"]);
    r = r.filter((e) => {
      return e != "";
    });
    const fileString = r.reduce((a, c) => {
      return a + c + "\n";
    }, "");
    fs.writeFileSync(arttsPath, fileString);
  });
});
