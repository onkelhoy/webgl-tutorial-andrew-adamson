const canvas = document.querySelector("canvas");
canvas.width = 600;
canvas.height = 400;
const gl = canvas.getContext("webgl2");

const vertexShaderSource = `#version 300 es

  layout(location=0) in vec2 aPosition;
  layout(location=1) in float aDepth;
  layout(location=2) in vec4 aColor;

  out vec4 vColor;

  void main()
  {
    vColor = aColor;
    gl_Position = vec4(aPosition.xy, aDepth, 1);
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


const bufferData = new Float32Array([
  // pos      depth      color      alpha
  -.5,-.5,    0.5,       1,0,0,     .5, // red
  0,.5,       0.5,       1,0,0,     .5,
  .5,-.5,     0.5,       1,0,0,     .5,

  -.5,.5,     -.5,       0,1,0,     .5, // green
  .5,0,       -.5,       0,1,0,     .5,
  -.5,-.5,    -.5,       0,1,0,     .5,

  .5,.5,      0.0,       0,0,1,     .5, // blue
  -.5,0,      0.0,       0,0,1,     .5,
  .5,-.5,     0.0,       0,0,1,     .5,
]);


const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 28, 0);
gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 28, 8);
gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 28, 12);

gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);
gl.enableVertexAttribArray(2);


gl.clearColor(0,0,0,1);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL); // gl.LESS is default 
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

// gl.drawArrays(gl.TRIANGLES, 0, 3); // red 
// gl.depthMask(false);
// gl.drawArrays(gl.TRIANGLES, 6, 3); // blue 
// gl.drawArrays(gl.TRIANGLES, 3, 3); // green 
// gl.depthMask(true);
gl.drawArrays(gl.TRIANGLES, 0, 3); // red 
gl.drawArrays(gl.TRIANGLES, 6, 3); // blue 
gl.drawArrays(gl.TRIANGLES, 3, 3); // green 