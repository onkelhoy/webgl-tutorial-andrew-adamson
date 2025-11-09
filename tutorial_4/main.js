const canvas = document.querySelector("canvas");
canvas.width = 600;
canvas.height = 400;
const gl = canvas.getContext("webgl2");

const vertexShaderSource = `#version 300 es

  layout(location = 0) in float aPointSize;
  layout(location = 1) in vec2 aPosition;
  layout(location = 2) in vec3 aColor;

  out vec3 vColor;

  void main()
  {
    vColor = aColor;
    gl_PointSize = aPointSize;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `#version 300 es

  precision mediump float;

  in vec3 vColor;
  
  out vec4 fragColor;

  void main()
  {
    fragColor = vec4(vColor, 1.0);
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

// [OPTION B] : manual through JS 
// const aPositionLoc = 0;
// const aPointSizeLoc = 1;
// const aColorLoc = 2;
// gl.bindAttribLocation(program, aPositionLoc, "aPosition");
// gl.bindAttribLocation(program, aPointSizeLoc, "aPointSize");
// gl.bindAttribLocation(program, aColorLoc, "aColor");

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS))
{
  console.log({
    vertex: gl.getShaderInfoLog(vertexShader),
    fragment: gl.getShaderInfoLog(fragmentShader),
  });
}

gl.useProgram(program); 

const bufferData = new Float32Array([
  // position - size 
  0,1,           100,      1,0,0,
  -1,-1,         32,       0,1,0,
  1,-1,          50,       0,0,1, // we have 3 total points 
]);

// [OPTION A] : let gl decide 
// const aPositionLoc = gl.getAttribLocation(program, "aPosition");
// const aPointSizeLoc = gl.getAttribLocation(program, "aPointSize");
// const aColorLoc = gl.getAttribLocation(program, "aColor");
// console.log(aPositionLoc,aPointSizeLoc,aColorLoc) // outputs: 1, 0, 2

// [OPTION C] : manual with JS + vertex-shader - layout(location = number)
const aPointSizeLoc = 0;
const aPositionLoc = 1;
const aColorLoc = 2;

gl.enableVertexAttribArray(aPositionLoc);
gl.enableVertexAttribArray(aPointSizeLoc);
gl.enableVertexAttribArray(aColorLoc);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);

gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 6 * 4, 0);
gl.vertexAttribPointer(aPointSizeLoc, 1, gl.FLOAT, false, 6 * 4, 2 * 4);
gl.vertexAttribPointer(aColorLoc, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

// draw points 
// gl.drawArrays(gl.POINTS, 0, 3); // 3 is for how many 

// draw lines 
// gl.drawArrays(gl.LINES, 0, 3); // 3 is for how many 
// gl.drawArrays(gl.LINE_STRIP, 0, 3); // 3 is for how many 
// gl.drawArrays(gl.LINE_LOOP, 0, 3); // 3 is for how many 

// draw triangles 
gl.drawArrays(gl.TRIANGLES, 0, 3); // 3 is for how many 