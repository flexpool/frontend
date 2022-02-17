uniform float u_time;
uniform float u_frequency;
uniform float u_speed;

varying float v_elevation;
varying float v_temp;



void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(( acos(position.x / 3.0) * u_frequency) + u_time * u_speed) * 0.15;

  modelPosition.z += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;

  gl_Position = projectionMatrix * viewPosition;

  v_elevation = elevation;
  v_temp = position.x;
}