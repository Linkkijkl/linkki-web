#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_primary_accent;
uniform int u_dark_mode;
uniform float u_random;

out vec4 outColor;


vec3 hash33(vec3 p3) {
    p3 = fract(p3 * vec3(443.8975f, 397.2973f, 491.1871f));
    p3 += dot(p3, p3.yxz + 19.19f);
    return -1.0f + 2.0f * fract(vec3((p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y, (p3.y + p3.z) * p3.x));
}


float simplex_noise(vec3 p) {
    const float K1 = 0.333333333f;
    const float K2 = 0.166666667f;

    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);

    vec3 e = step(vec3(0.0f), d0 - d0.yzx);
    vec3 i1 = e * (1.0f - e.zxy);
    vec3 i2 = 1.0f - e.zxy * (1.0f - e);

    vec3 d1 = d0 - (i1 - 1.0f * K2);
    vec3 d2 = d0 - (i2 - 2.0f * K2);
    vec3 d3 = d0 - (1.0f - 3.0f * K2);

    vec4 h = max(0.6f - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0f);
    vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0f)));

    return dot(vec4(31.316f), n);
}


void main() {
    float TIMESCALE = 0.05f;

    vec2 a = vec2(gl_FragCoord.xy / u_resolution);
    float simplex = clamp((1.0f) - simplex_noise(vec3(a.x, a.y, u_random + u_time * TIMESCALE)), 0.0f, 1.0f);
    if (u_dark_mode == 1){
        simplex = 1.0f - simplex;
    }
    vec3 color = vec3(simplex) * u_primary_accent;
    vec3 fade_from;
    if (u_dark_mode == 1) {
        fade_from = vec3(0);
    } else {
        fade_from = u_primary_accent;
    }
    float fade = min(u_time * 0.3f, 1.0f);
    outColor = vec4(mix(fade_from, color, fade), 1.0);
}