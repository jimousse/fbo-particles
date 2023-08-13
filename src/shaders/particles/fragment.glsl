varying vec3 vColor;
void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.02 / distanceToCenter - 0.1;
    gl_FragColor = vec4(vColor, strength);
}