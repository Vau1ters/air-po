/* eslint-disable @typescript-eslint/no-explicit-any */

export function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) {
    throw new Error(msg)
  }
}

export function assertSingle(n: number, name: string): void {
  assert(n > 0, `There are no '${name}'.`)
  assert(n < 2, `There are multiple '${name}'.`)
}

export function checkMembers(
  json: any,
  nameList: { [key: string]: 'number' | 'string' | 'array' | 'any' },
  nameOfThis: string
): void {
  for (const name of Object.keys(nameList)) {
    if (!json[name]) {
      throw new Error(`"${name}" is not contained in ${nameOfThis}`)
    }
    const type = nameList[name]
    switch (type) {
      case 'number':
        if (typeof json[name] !== 'number')
          throw new Error(`typeof ${name} in ${nameOfThis} must be number`)
        break
      case 'string':
        if (typeof json[name] !== 'string')
          throw new Error(`typeof ${name} in ${nameOfThis} must be string`)
        break
      case 'array':
        if (!(json[name] instanceof Array))
          throw new Error(`typeof ${name} in ${nameOfThis} must be array`)
        break
      case 'any':
        break
    }
  }
  for (const name of Object.keys(json)) {
    if (!Object.keys(nameList).includes(name)) {
      throw new Error(`Unknown member "${name}" is found in ${nameOfThis}`)
    }
  }
}
