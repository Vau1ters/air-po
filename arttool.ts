import * as fs from 'fs'

const outputPath = 'src/core/graphics/spriteURL.ts'
const spriteDir = 'res/sprite'

const importList: string[] = []
const nameList: string[] = []

fs.readdirSync(spriteDir, { withFileTypes: true }).forEach(e => {
  const settingFile = e.name
  const { name } = require(`./${spriteDir}/${settingFile}`) // eslint-disable-line  @typescript-eslint/no-var-requires

  importList.push(`import ${name} from '@${spriteDir}/${settingFile}'`)

  nameList.push(name)
})

const generatedText = `
/*+.† NOTIFICATION †.+*/
// this file is automatically written by arttool.
// you can update this file by type "yarn arttool" command.

// IMPORT
${importList.join('\n')}

export const spriteURL = {
  // OBJECT
  ${nameList.join(',')}
}

`
fs.writeFile(outputPath, generatedText, () => {})
