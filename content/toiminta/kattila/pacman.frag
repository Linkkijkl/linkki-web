#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_primary_accent;
uniform int u_dark_mode;

out vec4 outColor;

vec3 cameraPosition;
vec3 lightPosition;

const float EPSILON = 0.001f;
const float PI = 3.1415f;
const float timeScale = 0.2f;

// Some utility functions for logical operations etc.
float unionCSG(float a, float b) {
    return min(a, b);
}
float differenceCSG(float a, float b) {
    return max(a, -b);
}
float intersectionCSG(float a, float b) {
    return max(a, b);
}

// A signed distance function for a box
float sdfBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0f)) + min(max(q.x, max(q.y, q.z)), 0.0f);
}

// A signed distance function for a sphere
float sdfSphere(vec3 p, float r) {
    return length(p) - r;
}

vec3 op_repeat(vec3 p, vec3 c) {
    return mod(p, c) - (0.5f) * c;
}

mat2 op_rotate(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

// Slap all drawables here
float mapTheWorld(vec3 p) {
    p -= vec3(sin(u_time * timeScale) * 0.2f, cos(u_time * timeScale) * 0.2f, -u_time * timeScale * 3.0f);
    p.xy *= op_rotate(PI / 4.0f);
    p = op_repeat(p, vec3(2.5f, 2.5f, 2.5f));
    float sphere0 = sdfSphere(p - vec3(0.0f, 0.0f, 0.0f), 1.0f);
    float cube0 = sdfBox(p - vec3(1.0f, 1.0f, 0.0f), vec3(1.0f, 1.0f, 2.0f));
    float sphere1 = sdfSphere(p - vec3(0.5f, 0.5f, 0.0f), 0.2f);
    return unionCSG(sphere1, differenceCSG(sphere0, cube0));
}

// Calclulate the normal for the object
vec3 calcNormal(vec3 p) {
    const vec2 tinyStep = vec2(EPSILON, 0.0f);

    float gradX = mapTheWorld(p + tinyStep.xyy) - mapTheWorld(p - tinyStep.xyy);
    float gradY = mapTheWorld(p + tinyStep.yxy) - mapTheWorld(p - tinyStep.yxy);
    float gradZ = mapTheWorld(p + tinyStep.yyx) - mapTheWorld(p - tinyStep.yyx);

    return normalize(vec3(gradX, gradY, gradZ));
}

// Variables for lighting, light colours and such
const float ambientStrength = 0.3f;
const vec3 ambientColor = vec3(0.0f, 0.0f, 0.0f);
const vec3 lightColor = vec3(1.0f, 1.0f, 1.0f);
const vec3 objectColor = vec3(0.219f, 0.490f, 1.0f);

// Calculate shading for the object
vec3 calcShading(vec3 position, vec3 normal) {

    vec3 ambientLight = ambientColor * ambientStrength;

    vec3 dirToLight = normalize(lightPosition - position);
    vec3 diffuseLight = max(0.0f, dot(normal, dirToLight)) * lightColor;

    return objectColor * (ambientLight + diffuseLight);
}

// The raymarch function.
vec3 rayMarch(vec3 ro, vec3 rd) {

    float dTraveled = 0.0f;         // Distance travelled so far
    const int STEPNUM = 100;        // Number of maximum steps
    const float MAXDIST = 15.0f;    // Maximum distance for the ray to travel.

    for(int i = 0; i < STEPNUM; ++i) {

        // Set the current position on the ray
        vec3 currentPosition = ro + dTraveled * rd;

        // Calculate the SDFs
        float distanceToClosest = mapTheWorld(currentPosition);

        // If a hit, then calculate normals and shading.
        if(distanceToClosest < EPSILON) {
            vec3 normal = calcNormal(currentPosition);
            return calcShading(currentPosition, normal);
        }

        // If distance travelled has hit the limit, break the loop
        if(dTraveled > MAXDIST)
            break;

        // Otherwise, add results of the SDF to the travelled distance.
        dTraveled += distanceToClosest;
    }
    
    // If no hits are registered, return ambient color.
    return ambientColor * ambientStrength;
}

void main() {
    // Should be self explanatory
    cameraPosition = vec3(0.0f, 0.0f, -5.0f);
    lightPosition = cameraPosition;

    // Set up everything for the raymarching and march the ray
    float aspectRatio = u_resolution.x / u_resolution.y;
    vec2 uv = gl_FragCoord.xy / u_resolution - vec2(0.5f);
    uv.x = uv.x * aspectRatio;
    vec3 ro = cameraPosition;
    vec3 screen = vec3(uv, ro.z + 1.0f);
    vec3 rd = normalize(screen - ro);
    vec3 marchResult = vec3(rayMarch(ro, rd));

    // Start fade
    vec3 fade_from;
    if (u_dark_mode == 1) {
        fade_from = vec3(0);
    } else {
        fade_from = u_primary_accent;
    }
    float fade = min(u_time * 0.3f, 1.0f);

    outColor = vec4(mix(fade_from, marchResult, fade), 1.0);
}