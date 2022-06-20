varying vec3 v_color;
varying vec2 v_uv;
varying float v_op;

void main() {
  gl_FragColor = vec4(0.87, 0.31, 0.65, v_op);
}