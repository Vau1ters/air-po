precision highp float;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;
varying vec4 vColor;

uniform vec3 points[200];
uniform float pointNum;
uniform vec2 displaySize;
uniform float effectiveRadius;

void main() {
  vec4 color = texture2D(uSampler, vTextureCoord);
  vec2 coord = vTextureCoord * displaySize;

  float metaball = 0.0;
  for(int i = 0; i < 200; i++) {
    if (i < int(pointNum) && abs(points[i].z) > 1e-3) {
      vec2 d = coord - points[i].xy;
      float dist = dot(d, d);
      float r = points[i].z;
      float score = max(0.0, (r * r) * (1.0 / dist - 1.0 / (effectiveRadius * effectiveRadius)));
      metaball += score;
    }
  }
  if (metaball < 1.0) {
    color.rgb += metaball * 0.6 + 0.2;
  }

  gl_FragColor = color;
}
