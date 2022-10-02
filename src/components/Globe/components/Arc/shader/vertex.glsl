varying float v_distance;
varying vec3 v_color;
varying vec2 v_uv;
varying float v_op;

uniform float u_time;
uniform float u_forward_time;
uniform float u_wait_time;
uniform float u_retreat_time;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  float forwardTime = u_forward_time;
  float waitTime = u_wait_time;
  float retreatTime = u_retreat_time;


  float w = max((min(u_time*(1./u_forward_time), 1.)), (u_time - u_wait_time)/u_retreat_time + 1.);


  float op_2 = 1.0 - step( w , uv.x);
  float op = step(w - 1.0, uv.x);


  v_color = vec3(abs(sin(u_time))) * w;
  v_uv = uv;

  float op_mul = step(1., w);
  float op_2_mul = 1. - op_mul;

  v_op = op * op_mul + op_2 * op_2_mul;
}