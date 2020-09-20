precision highp float;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;
varying vec4 vColor;

const int MAX_POINT_NUM = 200;

uniform vec3 points[MAX_POINT_NUM];
uniform float pointNum;
uniform vec2 displaySize;
uniform float effectiveRadius;
uniform float inAirRate;

void main() {
  vec4 color = texture2D(uSampler, vTextureCoord);
  vec2 coord = vTextureCoord * displaySize;

  float metaball = 0.0;
  for(int i = 0; i < MAX_POINT_NUM; i++) {
    if (i >= int(pointNum)) continue;
    if (abs(points[i].z) > 1e-3) {
      vec2 d = coord - points[i].xy;
      float dist = dot(d, d);
      float r = points[i].z;
      float score = max(0.0, (r * r) * (1.0 / dist - 1.0 / (effectiveRadius * effectiveRadius)));
      metaball += score;
    }
  }
  if (metaball < 1.0) {
    color.rgb *= 1. * (1. - pow(metaball, 2.) * 0.3) * vec3(1);
  }

  gl_FragColor = color;
  gl_FragColor.rgb *= mix(pow(cos(0.7 * length(vTextureCoord - 0.5) * 3.141592 * .5), 4.), 1., inAirRate);
}
