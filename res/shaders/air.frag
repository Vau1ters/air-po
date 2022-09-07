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
uniform ivec2 camera;
uniform bool enableAntiAlias;
uniform vec4 inputSize;
uniform vec4 outputFrame;

float air(ivec2 coord) {
  float metaball = 0.0;
  for(int i = 0; i < MAX_POINT_NUM; i++) {
    if (i >= int(pointNum)) continue;
    if (abs(points[i].z) > 1e-3) {
      vec2 d = vec2(coord) - points[i].xy;
      float dist = dot(d, d);
      float r = points[i].z;
      float score = max(0.0, (r * r) * (1.0 / dist - 1.0 / (effectiveRadius * effectiveRadius)));
      metaball += score;
    }
  }
  if (metaball < 1.0) {
    return .5 * (1. - pow(metaball, 2.) * 0.9);
  } else {
    return 1.;
  }
}

bool inside(ivec2 coord) {
  return air(coord) == 1.;
}

bool shouldAntiAlias(ivec2 coord) {
  bool flag[8];
  flag[0] = inside(coord + ivec2(-1,-1));
  flag[1] = inside(coord + ivec2( 0,-1));
  flag[2] = inside(coord + ivec2(+1,-1));
  flag[3] = inside(coord + ivec2(+1, 0));
  flag[4] = inside(coord + ivec2(+1,+1));
  flag[5] = inside(coord + ivec2( 0,+1));
  flag[6] = inside(coord + ivec2(-1,+1));
  flag[7] = inside(coord + ivec2(-1, 0));
  for (int i = 0; i < 8; i++) {
    bool shouldAntiAlias = true;
    for (int j = 0; j < 4; j++) {
      shouldAntiAlias = shouldAntiAlias && (flag[int(mod(float(i+j),8.0))] == true);
    }
    for (int j = 4; j < 8; j++) {
      shouldAntiAlias = shouldAntiAlias && (flag[int(mod(float(i+j),8.0))] == false);
    }
    if (shouldAntiAlias) return true;
  }
  return false;
}

void main() {
  vec4 color = texture2D(uSampler, vTextureCoord);
  vec2 uv = vTextureCoord / (inputSize.zw * outputFrame.zw);
  ivec2 coord = ivec2(uv * displaySize) + camera;
  float rate = 0.;
  if (enableAntiAlias) {
    rate = shouldAntiAlias(coord) ? (1. + air(coord)) * .5 : air(coord);
  } else {
    rate = air(coord);
  }
  gl_FragColor = mix(vec4(.5, .4, .5, 1), color, rate);
  gl_FragColor.rgb *= mix(pow(cos(0.7 * length(uv - 0.5) * 3.141592 * .5), 2.), 1., inAirRate);
}
