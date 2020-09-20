precision highp float;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

const vec2 lightPos = vec2(0.5, 0.5);

void main() {
  vec3 color = texture2D(uSampler, vTextureCoord).rgb;
  float l = length(lightPos - vTextureCoord);
  float po = min(1., pow(l, -1.) * 1e-2);
  vec3 baseColor = vec3(0.9, 1, 0.6);
  vec3 white = vec3(1);
  // mix(a,b,t) = (1-t) * a + t * b
  // color *= mix(baseColor, white, po) * po;
  color *= baseColor * po;
  // color += vec3(0.9, 1, 0.5) * min(.3, pow(l, -2.) * 1e-3);
  gl_FragColor = vec4(color, 1);
}
