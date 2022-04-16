uniform vec3 u_color;
uniform float u_time;

varying float v_elevation;
varying float v_temp;
varying float v_horizontal;
varying float v_vertical;
varying float v_collision;
varying vec2 v_uv;

float EaseInSine(float x){
  return 1.0 - cos((x * 3.1415926) / 2.0);
}

float EaseOutSine(float x) {
  return sin((x * 3.1415926) / 2.0);
}

float norm(float x, float max, float min){
  return (x - min) / (max - min);
}

float EaseOutCubic(float x) {
  return 1.0 - pow(1.0 - x, 3.0);
}

float Fading(float x) {
  return pow(x, 8.0);
}

void main() {
  
  float speed_control = 0.3;

  float a = mod(u_time * speed_control,0.5) ;

  // 0 - 0.5 (which is the radius)
  float m = 0.0;

  float p = 0.5;

  if ( a < p) {
    m = EaseOutCubic(norm(a, p, 0.0)) / 2.0;
  }


  // 0 or 1
  float circle_point = 1.0 - step(m, distance(v_uv, vec2(0.5)));

  float base = 1.0 - step(0.2, distance(v_uv, vec2(0.5)));

  float transparency = circle_point * (1.0 - Fading( m * 2.0));


  if (base == 1.0) {
    gl_FragColor = vec4(u_color, 1.0);
  } else {
    gl_FragColor = vec4(u_color, transparency * 0.7);
  }

  
}