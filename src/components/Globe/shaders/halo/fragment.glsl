uniform vec3 u_color;

varying float intensity;
void main() {
  vec3 glow = u_color * intensity;

  float d = distance(glow, vec3(0.0));

  gl_FragColor = vec4(glow , pow(d, 3.0));
}