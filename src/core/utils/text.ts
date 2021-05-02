export const normalizeText = (text: string): string => {
  const table: { [key: string]: string } = {
    が: 'か゛',
    ぎ: 'き゛',
    ぐ: 'く゛',
    げ: 'け゛',
    ご: 'こ゛',
    ざ: 'さ゛',
    じ: 'し゛',
    ず: 'す゛',
    ぜ: 'せ゛',
    ぞ: 'そ゛',
    だ: 'た゛',
    ぢ: 'ち゛',
    づ: 'つ゛',
    で: 'て゛',
    ど: 'と゛',
    ば: 'は゛',
    び: 'ひ゛',
    ぶ: 'ふ゛',
    べ: 'へ゛',
    ぼ: 'ほ゛',
    ぱ: 'は゜',
    ぴ: 'ひ゜',
    ぷ: 'ふ゜',
    ぺ: 'へ゜',
    ぽ: 'ほ゜',
    ガ: 'カ゛',
    ギ: 'キ゛',
    グ: 'ク゛',
    ゲ: 'ケ゛',
    ゴ: 'コ゛',
    ザ: 'サ゛',
    ジ: 'シ゛',
    ズ: 'ズ゛',
    ゼ: 'ゼ゛',
    ゾ: 'ゾ゛',
    ダ: 'タ゛',
    ヂ: 'チ゛',
    ヅ: 'ツ゛',
    デ: 'テ゛',
    ド: 'ト゛',
    バ: 'ハ゛',
    ビ: 'ヒ゛',
    ブ: 'フ゛',
    ベ: 'ヘ゛',
    ボ: 'ホ゛',
    パ: 'ハ゜',
    ピ: 'ヒ゜',
    プ: 'フ゜',
    ペ: 'ヘ゜',
    ポ: 'ホ゜',
  }
  let result = ''
  for (let i = 0; i < text.length; i++) {
    const c = text.charAt(i)
    if (c in table) {
      result += table[c]
    } else {
      result += c
    }
  }
  return result
}
