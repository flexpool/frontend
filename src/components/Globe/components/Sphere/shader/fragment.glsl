uniform vec3 fresnel_color;

varying float v_elevation;
varying float v_temp;
varying vec2 v_uv;
varying vec3 v_position;
varying float v_fresnel;

void main() {
  gl_FragColor = vec4(fresnel_color * v_fresnel, 1.0);
}