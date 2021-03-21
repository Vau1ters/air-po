attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;
uniform vec2 anchor;
uniform float angle;
uniform float scale;

vec2 rot(vec2 v, float a) {
    float c = cos(a);
    float s = sin(a);
    mat2 r = mat2(c, -s, s, c);
    return r * v;
}

vec4 filterVertexPosition( void )
{
    vec2 center = anchor * outputFrame.zw;

    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.));
    position = scale * rot(position - center, angle) + center;
    position += outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
