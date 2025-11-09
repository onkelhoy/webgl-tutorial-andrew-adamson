const canvas = document.querySelector("canvas");
canvas.width = 600;
canvas.height = 400;
const gl = canvas.getContext("webgl2");

const vertexShaderSource = `#version 300 es

  layout(location=0) in vec2 aPosition;
  layout(location=1) in float aPointSize;
  layout(location=2) in vec3 aColor;

  out vec4 vColor;

  void main()
  {
    vColor = vec4(aColor, 1.0);
    gl_Position = vec4(aPosition, 0.0, 1.0);
    gl_PointSize = aPointSize;
  }
`;

const fragmentShaderSource = `#version 300 es

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

const aPositionLoc = 0;
const aPointSizeLoc = 1;
const aColorLoc = 2;

// PART A 
const vertData = new Float32Array([
  -0.6618, -0.7687,       50,      0.5849,  0.7600,  0.4662,
  -0.3149, -0.7417,       10,      0.9232,  0.9332,  0.4260,
   0.9749, -0.8996,       40,      0.6969,  0.5353,  0.1471,
  -0.9202, -0.2956,       90,      0.2899,  0.9056,  0.7799,
   0.4559, -0.0642,       20,      0.2565,  0.6451,  0.8498,
   0.6192,  0.5755,       70,      0.6133,  0.8137,  0.4046,
  -0.5946,  0.7057,       20,      0.6745,  0.5229,  0.4518,
   0.6365,  0.7236,       70,      0.4690,  0.0542,  0.7396,
   0.8625, -0.0835,       20,      0.3708,  0.6588,  0.8611,
   0.7997,  0.4695,       70,      0.7490,  0.3797,  0.6879,
]);

// this is similair to uniform but uniforms "should" be set once 
// gl.vertexAttrib4f(aPositionLoc, 0,0,0,1);
// gl.vertexAttrib1f(aPointSizeLoc, 50);
// gl.vertexAttrib4f(aColorLoc, 1,0,0,1);

const vertBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertData, gl.STATIC_DRAW);

gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 24, 0);
gl.vertexAttribPointer(aPointSizeLoc, 1, gl.FLOAT, false, 24, 8);
gl.vertexAttribPointer(aColorLoc, 3, gl.FLOAT, false, 24, 12);

gl.enableVertexAttribArray(aPositionLoc);
gl.enableVertexAttribArray(aPointSizeLoc);
gl.enableVertexAttribArray(aColorLoc);


// PART B 
// const positionData = new Float32Array([
//   0.0, 0.0, 
//   -.5, 0.5,
//   -.5, -.5,
//   0.5, -.5,
//   0.5, 0.5,
// ]);

// const pointSizeData = new Float32Array([
//   20,
//   30,
//   40,
//   50,
//   60,
// ]);

// const colorData = new Float32Array([
//   1,0,0,
//   0,1,0,
//   0,0,1,
//   1,0,1,
//   0,1,1,
// ]);

// const positionBuffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);

// const pointSizeBuffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, pointSizeBuffer);
// gl.bufferData(gl.ARRAY_BUFFER, pointSizeData, gl.STATIC_DRAW);

// const colorBuffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);


// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

// gl.bindBuffer(gl.ARRAY_BUFFER, pointSizeBuffer);
// gl.vertexAttribPointer(aPointSizeLoc, 1, gl.FLOAT, false, 0, 0);

// gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// gl.vertexAttribPointer(aColorLoc, 3, gl.FLOAT, false, 0, 0);


// gl.enableVertexAttribArray(aPositionLoc);
// gl.enableVertexAttribArray(aPointSizeLoc);
// gl.enableVertexAttribArray(aColorLoc);

gl.drawArrays(gl.POINTS, 0, 10);