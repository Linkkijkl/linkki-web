const canvas = document.getElementById("shader");
const homeCarousel = document.getElementsByClassName("home-carousel")[0];
const shaderPath = canvas.getAttribute("data-shader");

let gl = null;
let shaderProgram;
let resolutionLocation;
let vertexArray = new Float32Array

const resizeCanvas = () => {
    canvas.width = homeCarousel.clientWidth;
    canvas.height = homeCarousel.clientHeight;
    if (gl != null) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    }
}

new ResizeObserver((entires) => {
    for (const entry of entires) {
        resizeCanvas();
    }
}).observe(homeCarousel);



const compileShader = (code, type) => {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(
            `Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"
            } shader:`,
        );
        console.log(gl.getShaderInfoLog(shader));
    }
    return shader;
}



const buildShaderProgram = (shaderInfo) => {
    const program = gl.createProgram();

    shaderInfo.forEach((desc) => {
        const shader = compileShader(desc.code, desc.type);

        if (shader) {
            gl.attachShader(program, shader);
        }
    });

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("Error linking shader program:");
        console.log(gl.getProgramInfoLog(program));
    }

    return program;
};


const getPrimaryAccent = () => {
    const hexToRgb = hex =>
        hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
            , (m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1).match(/.{2}/g)
            .map(x => parseInt(x, 16));
    return hexToRgb(
        getComputedStyle(document.body).getPropertyValue('--primary-accent')
    );
};


window.onload = () => {
    gl = canvas.getContext("webgl2");
    if (!gl) return;

    shaderProgram = buildShaderProgram([
        {
            type: gl.VERTEX_SHADER,
            code: `#version 300 es
            in vec4 a_position;

            void main() {
                gl_Position = a_position;
            }`
        },
        {
            type: gl.FRAGMENT_SHADER,
            code: `#version 300 es
            precision highp float;

            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec3 u_primary_accent;
            
            out vec4 outColor;
            
            vec3 cameraPosition;
            vec3 lightPosition;
            
            const float EPSILON = 0.001f;
            const float PI = 3.1415;
            const float timeScale = 1.0f;
            
            // Some utility functions for logical operations etc.
            float unionCSG(float a, float b) {return min(a, b);}
            float differenceCSG(float a, float b) {return max(a, -b);}
            float intersectionCSG(float a, float b) {return max(a, b);}

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
                return mod(p, c) - (0.5) * c;
            }
            
            mat2 op_rotate(float a) {
                float s = sin(a);
                float c = cos(a);
                return mat2(c, -s, s, c);
            }

            // Slap all drawables here
            float mapTheWorld(vec3 p) {
                p -= vec3(sin(u_time) * 0.2, cos(u_time) * 0.2, -u_time * 3.0);
                p.xy *= op_rotate(PI/4.0f);
                p = op_repeat(p, vec3(2.5, 2.5, 2.5));
                float sphere0 = sdfSphere(p - vec3(0.0, 0.0f, 0.0f), 1.0f);
                float cube0 = sdfBox(p - vec3(1.0f, 1.0f, 0.0f), vec3(1.0f, 1.0f, 2.0f));
                float sphere1 = sdfSphere(p - vec3(0.5f, 0.5f, 0.0f), 0.2);
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
            const vec3 lightColor = vec3(1.0f, 1.0f,  1.0f);
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
                const int STEPNUM = 100;         // Number of maximum steps
                const float MAXDIST = 15.0f;  // Maximum distance for the ray to travel.
              
                for (int i = 0; i < STEPNUM; ++i) {
                
                    // Set the current position on the ray
                    vec3 currentPosition = ro + dTraveled * rd;
                
                    // Calculate the SDFs
                    float distanceToClosest = mapTheWorld(currentPosition);
                
                    // If a hit, then calculate normals and shading.
                    if (distanceToClosest < EPSILON) {
                        vec3 normal = calcNormal(currentPosition);
                        return calcShading(currentPosition, normal);
                    }
                
                    // If distance travelled has hit the limit, break the loop
                    if (dTraveled > MAXDIST) break;
                
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
                float aspectRatio = u_resolution.x/u_resolution.y;
                vec2 uv = gl_FragCoord.xy/u_resolution - vec2(0.5f);
                uv.x = uv.x * aspectRatio;
                vec3 ro = cameraPosition;
                vec3 screen = vec3(uv, ro.z + 1.0f);
                vec3 rd = normalize(screen - ro);
                vec4 marchResult = vec4(rayMarch(ro, rd), 1);

                outColor = marchResult;
            }`
        }
    ]);

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
    resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
    const timeLocation = gl.getUniformLocation(shaderProgram, "u_time");
    const accentLocation = gl.getUniformLocation(shaderProgram, "u_primary_accent");

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // Create a buffer to put three 2d clip space points in
    const positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // fill it with a 2 triangles that cover clip space
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,  // first triangle
        1, -1,
        -1, 1,
        -1, 1,  // second triangle
        1, -1,
        1, 1,
    ]), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(
        positionAttributeLocation,
        2,          // 2 components per iteration
        gl.FLOAT,   // the data is 32bit floats
        false,      // don't normalize the data
        0,          // 0 = move forward size * sizeof(type) each iteration to get the next position
        0,          // start at the beginning of the buffer
    );

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.useProgram(shaderProgram);
    gl.bindVertexArray(vao);

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    const pa = getPrimaryAccent();
    console.log(pa);
    gl.uniform3f(accentLocation, pa[0] / 255.0, pa[1] / 255.0, pa[2] / 255.0);


    gl.uniform3f

    let timeTracker = 0.0;
    let startTime = document.timeline.currentTime;

    function render() {
        timeTracker = (document.timeline.currentTime - startTime) * 0.001;

        gl.uniform1f(timeLocation, timeTracker);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        window.requestAnimationFrame(render);
    }

    render();
}
