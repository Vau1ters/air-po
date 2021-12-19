import { spawnSync } from 'child_process'

const { status } = spawnSync('git', ['status', '--porcelain'])

process.exit(status ?? 1)
