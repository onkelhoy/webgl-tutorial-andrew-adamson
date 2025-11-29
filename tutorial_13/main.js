const canvas = document.querySelector("canvas");
canvas.width = 600;
canvas.height = 400;
const gl = canvas.getContext("webgl2");

function setupProgram(vertex, fragment) {
  const vertexShaderSource = vertex ?? `#version 300 es
  
    layout(location=0) in vec4 aPosition;
    layout(location=1) in vec3 aOffset;
    layout(location=2) in float aScale;
    layout(location=3) in vec4 aColor;
  
    out vec4 vColor;
  
    void main()
    {
      vColor = aColor;
      gl_Position = vec4(aPosition.xyz * aScale + aOffset, 1.0);
    }
  `;
  
  const fragmentShaderSource = fragment ?? `#version 300 es
  
    precision mediump float;
  
    in vec4 vColor;
    out vec4 fragColor;
  
    void main()
    {
      fragColor = vColor;
    }
  `;
  
  const program = gl.createProgram();
  
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  gl.attachShader(program, vertexShader);
  
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  gl.attachShader(program, fragmentShader);
  
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
  {
    console.log({
      vertex: gl.getShaderInfoLog(vertexShader),
      fragment: gl.getShaderInfoLog(fragmentShader),
    });
  }
  
  gl.useProgram(program); 
}

function alpha() {
  setupProgram();
  
  const modelData = new Float32Array([
    // position      offset       scale      color
    -1,-.7,          -.2,.7,      .1,        1,0,0,
    0,.8,            -.2,.7,      .1,        1,0,0,
    1,-.7,           -.2,.7,      .1,        1,0,0,

    -1,-.7,          .3,-.5,      .4,        0,0,1,
    0,.8,            .3,-.5,      .4,        0,0,1,
    1,-.7,           .3,-.5,      .4,        0,0,1,
  ]);
  const modelBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, modelData, gl.STATIC_DRAW);
  
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 32, 0);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 32, 8);
  gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 32, 16);
  gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 32, 20);

  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);
  gl.enableVertexAttribArray(2);
  gl.enableVertexAttribArray(3);
  
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
function beta() {
  setupProgram();

  const modelData = new Float32Array([
    // position      
    -1,-.7,
    0,.8,
    1,-.7,
  ]);
  const tranformData = new Float32Array([
    // offset       scale      color
    -.2,.7,          .1,        1,0,0,
    .3,-.5,          .4,        0,0,1,
  ])
  const modelBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, modelData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  for (let i=0; i<12; i+=6)
  {
    gl.vertexAttrib2fv(1, tranformData.slice(i+0, i+2));
    gl.vertexAttrib1fv(2, tranformData.slice(i+2, i+3));
    gl.vertexAttrib3fv(3, tranformData.slice(i+3, i+6));
    
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
function charlie() {
  setupProgram();

  const modelData = new Float32Array([
    // position      
    -1,-.7,
    0,.8,
    1,-.7,
  ]);
  const tranformData = new Float32Array([
    // offset       scale      color
    -.2,.7,          .1,        1,0,0,
    .3,-.5,          .4,        0,0,1,
  ]);
  const modelBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, modelData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const tranformBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tranformBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, tranformData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 24, 0);
  gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 24, 8);
  gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 24, 12);

  gl.vertexAttribDivisor(1, 1);
  gl.vertexAttribDivisor(2, 1);
  gl.vertexAttribDivisor(3, 2);

  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);
  gl.enableVertexAttribArray(2);
  gl.enableVertexAttribArray(3);

  gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, 2);
}
async function delta() {
  setupProgram(
    `#version 300 es

      layout(location=0) in vec4 aPosition;
      layout(location=4) in vec2 aTexCoord;

      layout(location=1) in vec3 aOffset;
      layout(location=2) in float aScale;
      layout(location=3) in float aDepth;
    
      out vec2 vTexCoord;
      out float vDepth;
    
      void main()
      {
        vDepth = aDepth;
        vTexCoord = aTexCoord;
        gl_Position = vec4(aPosition.xyz * aScale + aOffset, 1.0);
      }
    `, 
    `#version 300 es
      precision mediump float;

      uniform mediump sampler2DArray uSampler;
    
      in vec2 vTexCoord;
      in float vDepth;
      out vec4 fragColor;
    
      void main()
      {
        fragColor = texture(uSampler, vec3(vTexCoord, vDepth));
      }
    `,
  )
  const modelData = new Float32Array([
    // position      uv  
    -1,-.7,          0,1,
    0,.8,            .5,0,
    1,-.7,           1,1,
  ]);
  const tranformData = new Float32Array([ 
    // offset       scale         depth
    -.3,.5,          .3,          1,
    .3,-.5,          .4,          0,
  ]);

  const image = await loadImage("./stacked.png");
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
  gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, image.width,image.width,2, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  const modelBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, modelData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
  gl.vertexAttribPointer(4, 2, gl.FLOAT, false, 16, 8);

  const transformBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, tranformData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 0);
  gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 16, 8);
  gl.vertexAttribPointer(3, 1, gl.FLOAT, false, 16, 12);

  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1); // offset
  gl.enableVertexAttribArray(2); // scale
  gl.enableVertexAttribArray(3); // depth
  gl.enableVertexAttribArray(4);

  gl.vertexAttribDivisor(1, 1); // offset
  gl.vertexAttribDivisor(2, 1); // scale
  gl.vertexAttribDivisor(3, 1); // depth

  gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, 2);
}

delta();

// HELPER FUNCTIONS
function loadImage(name) {
  return new Promise(res => {
    const image = new Image();
    image.src = name;
    image.onload = () => res(image);
  });
}
async function loadObj(name) {
  const res = await fetch(name);
  const buffer = await res.arrayBuffer();

  console.log(buffer);
}
/**
 * TERMOLOGY
 * 
 * gl.drawArrays(
 *    mode,     // gl.TRIANGLES
 *    first,    // bytes to skip 
 *    count,    // vertices per model
 * )
 * 
 * gl.drawArraysInstanced(
 *                    // MODEL VALUES
 *    mode,           // gl.TRIANGLES
 *    first,          // bytes to skip 
 *    count,          // vertices per model
 * 
 *                    // TRANSFORM VALUES
 *    instanceCount   // instances to draw 
 * )
 * 
 * gl.drawElementsInstanced(
 *                    // MODEL VALUES
 *    mode,           // gl.TRIANGLES
 *    first,          // bytes to skip 
 *    count,          // vertices per model
 *    offset          // vertices per model
 * 
 *                    // TRANSFORM VALUES
 *    instanceCount   // instances to draw 
 * )
 * 
 * gl.vertexAttribDivisor(
 *    location,       // attribute location
 *    diviser,        // times to reuse transform value
 * )
 */