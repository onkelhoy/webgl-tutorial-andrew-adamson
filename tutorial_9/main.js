const canvas = document.querySelector("canvas");
const slider = document.querySelector("input");
canvas.width = 400;
canvas.height = 400;
const gl = canvas.getContext("webgl2");

const vertexShaderSource = `#version 300 es

  layout(location=0) in vec4 aPosition;
  layout(location=1) in vec2 aTexCoord;

  out vec2 vTexCoord;

  void main()
  {
    vTexCoord = aTexCoord;
    gl_Position = aPosition;
  }
`;

const fragmentShaderSource = `#version 300 es

  precision mediump float;

  in vec2 vTexCoord;
  uniform sampler2D uImageSampler;
  uniform float uMipLevel;

  out vec4 fragColor;

  void main()
  {
    fragColor = textureLod(uImageSampler, vTexCoord, uMipLevel);
  }
`;

const program = gl.createProgram();
{
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
}

gl.useProgram(program); 

const vertextBufferData = new Float32Array([
  -1, -1,     0,0,
  -1, 1,      0,1,
  1, -1,      1,0,

  1, -1,     1,0,
  -1, 1,     0,1,
  1, 1,      1,1,
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertextBufferData, gl.STATIC_DRAW);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);

const uMip = gl.getUniformLocation(program, "uMipLevel");

function loadImage() {
  return new Promise(res => {
    const image = new Image();
    image.src = "./brick.png";
    image.onload = () => res(image);
  })
}

async function init() {
  const image = await loadImage();
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  gl.uniform1i(gl.getUniformLocation(program, "uImageSampler"), 12);
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + 12);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  draw();
}
async function draw() {
  const level = Number(slider.value);
  gl.uniform1f(uMip, level);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
};

slider.onchange = draw;
init();