uniform vec3 u_color;

varying float intensity;
void main() {
  vec3 glow = u_color * intensity;
  gl_FragColor = vec4( glow, intensity );
}