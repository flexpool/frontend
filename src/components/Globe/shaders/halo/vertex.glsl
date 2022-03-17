uniform float u_dot_intensity;
uniform vec3 u_viewDirection;
varying float intensity;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  vec3 viewDirection = normalize(modelPosition.xyz - cameraPosition);

  vec3 wx = normalize(normalMatrix * normal);

  vec3 actual_normal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);

  intensity = pow( 0.5 - dot(normalize(u_viewDirection), wx), 13.0);
}