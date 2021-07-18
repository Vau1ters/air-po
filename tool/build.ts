import * as fs from 'fs'

type BuildOption = {
  outputPath: string
  watchDir: string
  templatePath: string
  onInput: (watchDir: string, e: fs.Dirent) => void
  replacementMap: () => { [keys: string]: string }
}

export const buildMetaSource = (option: BuildOption): string => {
  for (const e of fs.readdirSync(option.watchDir, { withFileTypes: true })) {
    option.onInput(option.watchDir, e)
  }

  const headerText = fs.readFileSync('tool/template/header.ts', 'ascii')
  let generatedText = fs.readFileSync(option.templatePath, 'ascii').replace('// HEADER', headerText)
  for (const [src, dst] of Object.entries(option.replacementMap())) {
    generatedText = generatedText.replace(`// ${src}`, dst)
  }
  fs.writeFileSync(option.outputPath, generatedText)
  return option.outputPath
}
