// varying vec2 v_uv;
// varying vec3 v_normal;
// varying float v_intensity;
// varying vec3 v_worldPosition;
// varying vec3 v_position;
// varying float v_frontShadow;

// void main() {

//   vec3 glow = vec3(1.0, 1.0, 1.0);

//   float intensity = smoothstep(0.1, 1.0, v_intensity);

  

//   gl_FragColor = vec4(vec3(intensity) , intensity);
// }

#define GLSLIFY 1
uniform vec3 glowColor;
varying float intensity;
varying float intensityA;
void main()
{
  

  gl_FragColor = vec4( vec3(1.0, 0.0, 0.0) * intensity, 1.0 * intensityA );
}