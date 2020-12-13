attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

uniform vec4 outputFrame;
uniform vec2 target;
uniform float scale;
uniform float angle;

vec2 rot(vec2 v, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec2(v.x * c - v.y * s, v.x * s + v.y * c);
}

vec4 filterVertexPosition( void )
{
    vec2 origin = target;
    origin *= outputFrame.zw;

    vec2 position = aVertexPosition;
    position *= outputFrame.zw;
    position -= origin;
    position = rot(position, angle);
    position *= scale;
    position += origin;
    position += outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = (aVertexPosition - 0.5) * vec2(+1,-1) + 0.5;
}
