void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  gl_Position = vec4(0.0,0.0,0.0,1.0);
}