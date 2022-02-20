import { spawnSync } from 'child_process'

const { output } = spawnSync('git', ['status', '--porcelain'], { encoding: 'ascii' })

let code = 0
for (const line of output) {
  if (line !== null && line !== '') {
    console.error(line)
    code = 1
  }
}

process.exit(code)
