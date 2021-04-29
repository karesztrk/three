uniform float time;
uniform float displacement;
uniform float elevation;
uniform float speed;

void main() {
    float factor = abs(sin(time)) * displacement;
    vec3 offset = normal * factor;

    float waveY = abs(sin(position.y + time * speed)) * elevation;
    vec3 newPosition = vec3(position + waveY * offset);
        
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

}
