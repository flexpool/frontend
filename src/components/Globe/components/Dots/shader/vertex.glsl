varying float v_distance;
varying vec3 v_color;

void main() {
  vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  v_distance = gl_Position.z;
  v_color = instanceColor;
}