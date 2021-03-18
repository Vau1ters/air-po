const fs = require('fs')

const imageWidth = 128
const imageHeight = 128
const textWidth = 8
const textHeight = 8
const chars = '                                 !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz           ヲァィゥェォャュョッ アイウエオカキクケコサシスセソ 。「」、・をぁぃぅぇぉゃゅょっーあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわん゛゜タチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン'
const fontName = 'got'

const xn = imageWidth / textWidth
const yn = imageHeight / textHeight

const result = []
for (let i = 0; i < chars.length; i++) {
    result.push(`<char id="${chars.charCodeAt(i)}" x="${(i % xn) * textWidth}" y="${Math.floor(i / xn) * textHeight}" width="${textWidth}" height="${textHeight}" xoffset="0" yoffset="0" xadvance="${textWidth}" page="0" chnl="15" />`)
}
const data = `<?xml version="1.0"?>
<font>
  <info face="${fontName}" size="${textHeight}" bold="0" italic="0" charset="" unicode="1" stretchH="100" smooth="0" aa="1" padding="0,0,0,0" spacing="1,1" outline="0"/>
  <common lineHeight="${textHeight}" base="6" scaleW="${imageWidth}" scaleH="${imageHeight}" pages="1" packed="0" alphaChnl="4" redChnl="0" greenChnl="0" blueChnl="0"/>
  <pages>
    <page id="0" file="${fontName}.png" />
  </pages>
  <chars count="${chars.length}">
${result.map(t => `    ${t}`).join('\n')}
  </chars>
</font>
`
fs.writeFileSync(fontName + '.fnt', data)