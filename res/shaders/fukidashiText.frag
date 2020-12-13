varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void){
   gl_FragColor = texture2D(uSampler, vTextureCoord);
   gl_FragColor.rgb = vec3(1) - gl_FragColor.rgb;
}