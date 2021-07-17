import * as fs from 'fs'
import * as path from 'path'

const outputPath = 'src/game/entities/loader/entitySetting.ts'
const entityDir = 'res/entity'

const importList: string[] = []
const nameList: string[] = []

fs.readdirSync(entityDir, { withFileTypes: true }).forEach(e => {
  const filename = e.name
  const name = path.parse(filename).name
  importList.push(`import ${name} from '@${entityDir}/${filename}'`)
  nameList.push(name)
})

const generatedText = `
/*+.† NOTIFICATION †.+*/
// this file is automatically written by entitytool.
// you can update this file by type "yarn entitytool" command.

// IMPORT
${importList.join('\n')}

export const entitySetting = {
  // OBJECT
  ${nameList.join(',')}
}

`
fs.writeFile(outputPath, generatedText, () => {})
