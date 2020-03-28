precision highp float;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;
varying vec4 vColor;

uniform float time;
uniform vec3 points[200];
uniform vec2 displaySize;

void main() {
  vec4 color = texture2D(uSampler, vTextureCoord);
  vec2 coord = vTextureCoord * displaySize;

  float metaball = 0.0;
  for(int i = 0; i < 200; i++) {
    if (points[i].z != 0.0) {
      float x = coord.x - points[i].x;
      float y = coord.y - points[i].y;
      float r = points[i].z;
      float score = (r * r) / (x * x + y * y);
      metaball += score;
    }
  }
  if (metaball < 1.1 + 0.02 * sin(time)) {
    color.rgb += metaball * 0.6 + 0.2;
  }

  gl_FragColor = color;
}
