varying vec2 v_uv;
varying vec3 v_position;
varying float v_fresnel;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  vec3 viewDirection = normalize(modelPosition.xyz - cameraPosition);
  vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);

  float fresnel = 0.9 * (1.0 + dot(viewDirection, worldNormal));
  fresnel = pow(fresnel, 4.0);

  v_fresnel = fresnel;
  v_uv = uv;
  v_position = modelPosition.xyz;
}