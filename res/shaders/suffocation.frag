precision highp float;
uniform sampler2D uSampler;
uniform float time;
uniform float suffocationRate;
varying vec2 vTextureCoord;

const float PI = 3.1415926535;

float rand(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float interpolate(float x, float y, float t) {
  t = t * t * (3. - 2. * t);
  return x * (1.-t) + y * t;
}

float irand(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float rand1 = rand(i+vec2(0,0));
  float rand2 = rand(i+vec2(1,0));
  float rand3 = rand(i+vec2(0,1));
  float rand4 = rand(i+vec2(1,1));
  float t1 = interpolate(rand1, rand2, f.x);
  float t2 = interpolate(rand3, rand4, f.x);
  return interpolate(t1, t2, f.y);
}

float noise(vec2 p) {
  float t = 0.;
  for (int i = 0; i < 8; i++) {
    float freq = pow(2., float(i));
    float amp = pow(0.5, float(8-i));
    t += irand(p / freq) * amp;
  }
  return t;
}

void main() {
  vec2 uv = vTextureCoord * 3e2 + vec2(time * 0.2347890, time * 0.349875) * 5.;
  vec2 diff = (vec2(noise(uv), noise(uv + vec2(114514, 1919810))) - .5) * 4e-2;
  float e = length(vTextureCoord - 0.5) * 2.;
  e = mix(0., e, suffocationRate);
  vec4 color = texture2D(uSampler, vTextureCoord + diff * e * 3.);
  uv = (vTextureCoord + diff * 1e1) * 1e3;
  float phase = noise(uv + vec2(237489.234798, 243798.234798)) * 2. * PI;
  color.rgb = mix(color.rgb, color.rgb * vec3(
      0.2 + 0.1 * sin(phase),
      0.2 + 0.1 * sin(phase + PI * 2. / 3.),
      0.2 + 0.1 * sin(phase - PI * 2. / 3.)
  ), e);
  gl_FragColor = color;
}
