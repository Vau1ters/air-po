"use strict";
exports.__esModule = true;
var fs = require("fs");
var fileText = "\n// IMPORT\nimport PIXI from 'pixi-sound'\n\nexport const soundStore: { [key: string]: PIXI.Sound } = {}\nexport const play = (name: string): void => {\n  const sound = soundStore[name]\n  if (sound !== undefined) sound.play()\n}\n\nconst load = (url: string): Promise<PIXI.Sound> => {\n  return new Promise((resolve, reject) => {\n    PIXI.Sound.from({\n      url: url,\n      preload: true,\n      loaded: (err, sound) => {\n        if (err) {\n          reject()\n        } else {\n          resolve(sound)\n        }\n      },\n    })\n  })\n}\n\nexport const init = async (): Promise<void> => {\n  // LOAD_RESOURCE \n}\n";
function importText(filename) {
    return "import shot from '@res/sound/" + filename + ".wav'";
}
function loadFormatText(filename) {
    return "soundStore." + filename + "= await load(" + filename + ")";
}
var soundPath = 'res/sound';
var dir = fs.readdirSync(soundPath, { withFileTypes: true });
var generatedText = fileText;
dir.forEach(function (e) {
    var filename = e.name.split('.')[0];
    var importReg = new RegExp('// IMPORT');
    var loadReg = new RegExp('// LOAD_RESOURCE');
    generatedText = generatedText.replace(importReg, "// IMPORT\n" + importText(filename));
    generatedText = generatedText.replace(loadReg, "// LOAD_RESOURCE\n  " + loadFormatText(filename));
});
console.log(generatedText);
