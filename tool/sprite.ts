import * as fs from 'fs'

export const buildSprite = (): void => {
  const outputPath = 'src/core/graphics/spriteURL.ts'
  const spriteDir = 'res/sprite'

  const importList: string[] = []
  const nameList: string[] = []

  fs.readdirSync(spriteDir, { withFileTypes: true }).forEach(e => {
    const settingFile = e.name
    const { name } = require(`../${spriteDir}/${settingFile}`) // eslint-disable-line  @typescript-eslint/no-var-requires
    importList.push(`import ${name} from '@${spriteDir}/${settingFile}'`)
    nameList.push(name)
  })

  const headerText = fs.readFileSync('tool/template/header.ts', 'ascii')
  const generatedText = fs
    .readFileSync('tool/template/spriteURL.ts', 'ascii')
    .replace('// HEADER', headerText)
    .replace('// IMPORT', importList.join('\n'))
    .replace('// OBJECT', nameList.join(','))
  fs.writeFile(outputPath, generatedText, () => {})
}
