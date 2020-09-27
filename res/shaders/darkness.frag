precision highp float;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

const int MAX_POINT_NUM = 200;

uniform vec3 points[MAX_POINT_NUM];
uniform float pointNum;
uniform vec2 displaySize;

const vec2 lightPos = vec2(0.5, 0.5);

const float LIGHT_RADIUS = 10.;

void main() {
  vec3 color = texture2D(uSampler, vTextureCoord).rgb;
  vec2 coord = vTextureCoord * displaySize;
  float power = .1;
  for (int i = 0; i < MAX_POINT_NUM; i++) {
    if (i >= int(pointNum)) continue;
    if (power > .1) continue;
    if (length(coord - points[i].xy) < LIGHT_RADIUS) {
      power += points[i].z;
    }
  }
  color *= min(1., power);
  gl_FragColor = vec4(color, 1);
}
