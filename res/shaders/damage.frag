precision highp float;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform bool damaging;

void main() {
  vec4 color = texture2D(uSampler, vTextureCoord);
  if (damaging) {
    gl_FragColor = vec4(1) * color.a;
  } else {
    gl_FragColor = color;
  }
}
