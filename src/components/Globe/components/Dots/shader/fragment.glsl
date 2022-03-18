varying float v_distance;
varying vec3 v_color;

void main() {
  gl_FragColor = vec4(v_color, 1.0);

  if (v_distance > 730.0) {
    float s = 1. - smoothstep(730., 850.0, v_distance);
    gl_FragColor.a = s;
  }
}