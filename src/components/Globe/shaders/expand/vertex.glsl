uniform float u_time;
uniform float u_frequency;
uniform float u_speed;

varying float v_elevation;
varying float v_temp;
varying float v_horizontal;
varying float v_vertical;
varying float v_collision;
varying vec2 v_uv;


void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(( acos(position.x / 3.0) * u_frequency) + u_time * u_speed) * 0.15;

  
  v_horizontal = sin(uv.x / (3.1415926 / 2.0));
  v_vertical = cos(0.5 - uv.y);

  // v_collision = sin(uv.x === cos())

  // modelPosition.z += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;

  gl_Position = projectionMatrix * viewPosition;

  v_elevation = elevation;
  v_temp = position.x;
  v_uv = uv;
}