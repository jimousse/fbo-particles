uniform sampler2D uPositions;
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
varying vec3 vColor;
attribute vec3 color;
attribute float aScale;

void main() {
  vec3 pos = texture2D(uPositions, position.xy).xyz;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  vColor = color;

  gl_PointSize = 100.0;
  // Size attenuation;
  gl_PointSize *= (1.0 / - viewPosition.z);
}