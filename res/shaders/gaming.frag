precision highp float;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform vec3 srcColor;
uniform vec3 dstColor;

void main() {
  vec4 color = texture2D(uSampler, vTextureCoord);
  if (color.rgb == srcColor) {
    gl_FragColor = vec4(dstColor, color.a);
  } else {
    gl_FragColor = color;
  }
}
