uniform vec3 u_color;

varying float v_elevation;
varying float v_temp;


void main() {
  gl_FragColor = vec4(u_color + v_elevation, 1.0);

  // gl_FragColor = vec4(vec3(v_elevation), 1.0);

  // gl_FragColor = vec4(u_color + v_temp * 0.1, 1.0);


}