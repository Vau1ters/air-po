precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 displaySize;
uniform vec4 inputSize;
uniform vec4 outputFrame;
uniform float frame;

void main() {
  vec3 color = texture2D(uSampler, vTextureCoord).rgb;
  vec2 uv = vTextureCoord / (inputSize.zw * outputFrame.zw);
  vec2 coord = uv * displaySize;

  float radius = length(coord - displaySize * .5);
  color *= radius < (200. - frame * 5.) ? 1. : 0.;
  gl_FragColor.rgb = color;
}
