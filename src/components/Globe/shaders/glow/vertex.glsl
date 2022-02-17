uniform float u_dot_intensity;

varying float intensity;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  vec3 viewDirection = normalize(modelPosition.xyz - cameraPosition);

  vec3 actual_normal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);

  intensity = pow( dot(viewDirection, actual_normal), 2.0 );
}