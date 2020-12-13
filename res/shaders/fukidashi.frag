precision highp float;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec2 displaySize;
uniform vec2 target;
uniform float tailSize;
uniform float border;
uniform float radius;
uniform vec4 inputSize;
uniform vec4 outputFrame;

float cross2(vec2 a, vec2 b) {
    return a.x * b.y - a.y * b.x;
}

float distSegment(vec2 pixel, vec2 start, vec2 end) {
    vec2 v = normalize(end - start);
    float l = length(end - start);
    float t = dot(pixel - start, v);
    return distance(pixel, start + clamp(t, 0., l) * v);
}

vec2 rot(vec2 v, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec2(v.x * c - v.y * s, v.x * s + v.y * c);
}

vec2 boxSize() {
    return displaySize - tailSize * 2. - radius * 2.;
}

float distBox(vec2 pixel) {
    vec2 q = abs(pixel) - boxSize() * 0.5;
  	return length(max(q,0.0)) + min(max(q.x, q.y),0.0) - radius;
}

float distTail(vec2 pixel) {
    vec2 anchor = (target - 0.5) * vec2(+1, -1) * displaySize;
    float bias = distance(pixel, anchor);
    float r = min(displaySize.x, displaySize.y) * 0.1;
    vec2 p0 = anchor;
    vec2 p1 = normalize(vec2(+anchor.y, -anchor.x)) * r;
    vec2 p2 = normalize(vec2(-anchor.y, +anchor.x)) * r;
    pixel = rot(pixel, -bias * 0.01);
    float d1 = distSegment(pixel, p1, p0);
    float d2 = distSegment(pixel, p2, p0);
    float s0 = -cross2(p1 - p0, pixel - p1);
    float s1 = -cross2(p2 - p1, pixel - p2);
    float s2 = -cross2(p0 - p2, pixel - p0);
    float s = s0 > 0. && s1 > 0. && s2 > 0. ? -1. : +1.;
    return min(d1, d2) * s;
}

float dist(vec2 pixel) {
    return min(distBox(pixel), distTail(pixel));
}

void main() {
    vec2 uv = vTextureCoord / inputSize.zw / outputFrame.zw;
    vec2 pixel = (uv - 0.5) * displaySize;
    float d = dist(pixel);
    if (0. < d && d < border) {
        gl_FragColor = vec4(0,0,0,1);
    } else if (d < 0.) {
        gl_FragColor = vec4(1);
    } else {
        gl_FragColor = vec4(0);
    }
}