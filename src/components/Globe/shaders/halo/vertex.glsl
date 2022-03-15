// varying vec2 v_uv;
// varying float v_intensity;
// varying vec3 v_normal;
// varying vec3 v_worldPosition;
// varying vec3 v_position;
// varying float v_frontShadow;
// uniform vec3 u_haloDirection;

// void main() {
//   vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//   vec4 viewPosition = viewMatrix * modelPosition;
//   gl_Position = projectionMatrix * viewPosition;

//   v_worldPosition = modelPosition.xyz;
//   v_position = position;

//   vec3 viewDirection = normalize((cameraPosition - modelPosition.xyz ));
//   // vec3 worldNormal = vec3(modelMatrix * vec4(normal, 0.0));
//   // vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
//   // vec3 worldNormal = normalize(vec3(modelMatrix * vec4(normal, 0.0)));

//   vec3 wn = vec3(modelMatrix * vec4(normal, 0.0));

//   vec3 wx = normalMatrix * normal;

//   vec3 viewVector = vec3(0., 0., 1.);

//   // aroura
//   float i2 =  pow( 0.6 -  dot(u_haloDirection, normalize(wx)), 5.0) ;


//   v_intensity = i2;
//   v_uv = uv;
//   v_normal = normal;
// }

#define GLSLIFY 1
uniform vec3 viewVector;
// uniform float c;
// uniform float p;
varying float intensity;
varying float intensityA;
void main() 
{
  vec3 vNormal = normalize( normalMatrix * normal );
  vec3 vNormel = normalize( normalMatrix * vec3(0.0, 0.0, cameraPosition.z));
  intensity = pow( 0.7 - dot(vNormal, vNormel), 15.0 );
  intensityA = pow( 0.63 - dot(vNormal, vNormel), 15.0 );
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}