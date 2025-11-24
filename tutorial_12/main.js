const canvas = document.querySelector("canvas");
const select = document.querySelector("select");
canvas.width = 400;
canvas.height = 400;
const gl = canvas.getContext("webgl2");

let animationFrame;

function handleChange() {
  cancelAnimationFrame(animationFrame);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.pixelStorei(gl.UNPACK_SKIP_PIXELS, 0);
  gl.pixelStorei(gl.UNPACK_SKIP_ROWS, 0);
  gl.pixelStorei(gl.UNPACK_ROW_LENGTH, 0);
  gl.pixelStorei(gl.UNPACK_IMAGE_HEIGHT, 0);
  gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, null);

  switch (select.value)
  {
    // case "tile":
    //   tile();
    //   break;
    case "runningMan":
      runningMan();
      break;
    case "allocate":
      allocate();
      break;
    case "full":
      full();
      break;
  }
}
select.onchange = handleChange;
handleChange();

const vertexShaderSource = `#version 300 es

  layout(location=0) in vec4 aPosition;
  layout(location=1) in vec2 aTexCoord;
  layout(location=2) in float aDepth;

  out vec2 vTexCoord;
  out float vDepth;

  void main()
  {
    vDepth = aDepth;
    vTexCoord = aTexCoord;
    gl_Position = aPosition;
  }
`;

const fragmentShaderSource = `#version 300 es

  precision mediump float;
  // precision mediump sampler2DArray;

  uniform mediump sampler2DArray uSampler;
  in vec2 vTexCoord;
  in float vDepth;
  out vec4 fragColor;

  void main()
  {
    fragColor = texture(uSampler, vec3(vTexCoord, vDepth));
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

const positionData = new Float32Array([
  -1,-1,        0,1,
  1,1,          1,0,
  -1,1,         0,0,
  -1,-1,        0,1,
  1,-1,         1,1,
  1,1,          1,0,
]);

async function tile() {
  const image = await loadTile(88);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
  // gl.texImage2D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, 128, 128, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, 128, 128, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, image); // 1 is the depth 
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
  gl.vertexAttrib1f(2, 1);
  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

async function runningMan() {
  const image = await loadImage("./running.1x10.png");

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
  gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, 128, 128, 10, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
  
  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);

  let count = 0;
  function animator() {
    gl.vertexAttrib1f(2, Math.floor(count / 4) % 10);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    count++;

    animationFrame = requestAnimationFrame(animator);
  }

  animator();
}

async function allocate() {
  let image = await loadTile(88);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
  gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGBA8, 128, 128, 126);
  
  const now = Date.now();
  for (let i=0; i<126; i++)
  {
    image = await loadTile(i);
    gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0,0,0, i, 128,128,1, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }
  console.log(Date.now() - now);

  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
  gl.vertexAttrib1f(2, 2);
  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

async function full() {
  const image = await loadImage("./atlas.png");
  const getImageName = await createUVlookup();

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
  gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGBA8, 128,128,126);

  const pbo = gl.createBuffer();
  gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, pbo);
  gl.bufferData(gl.PIXEL_UNPACK_BUFFER, getImageData(image), gl.STATIC_DRAW);
  gl.pixelStorei(gl.UNPACK_ROW_LENGTH, image.width);
  gl.pixelStorei(gl.UNPACK_IMAGE_HEIGHT, image.height);

  const now = Date.now();
  for (let i=0; i<126; i++)
  {
    const row = Math.floor(i/8) * 128;
    const col = (i % 8) * 128;

    gl.pixelStorei(gl.UNPACK_SKIP_PIXELS, col);
    gl.pixelStorei(gl.UNPACK_SKIP_ROWS, row);

    gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0,0,i, 128,128,1, gl.RGBA, gl.UNSIGNED_BYTE, 0);
  }
  console.log(Date.now() - now);

  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
  gl.vertexAttrib1f(2, 12);
  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// HELPER FUNCTIONS 

function loadImage(name) {
  return new Promise(res => {
    const image = new Image();
    image.src = name;
    image.onload = () => res(image);
  });
}
function loadTile(num) {
  return loadImage(`./tiles/tile${String(num).padStart(3, "0")}.png`);
}

async function createUVlookup() {
  const res = await fetch("./atlas.json");
  const data = await res.json();
  const names = Object.keys(data);

  return (index) => names[index] ?? null;
}
function getImageData(image) {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0,0);
  return ctx.getImageData(0,0,image.width, image.height).data;
}

/** TERMOLOGY
 * gl.texStorage3D(
 *    target,           // TEXTURE_2D_ARRAY
 *    levels,           // mipmap level count   
 *    internalFormatm   // internal storage format (RGBA8 for png kinda)
 *    width,            // width of all textures 
 *    height,           // height of all textures 
 *    depth,            // texture array "count" or "lenght"
 * );
 * 
 * 
 * gl.texSubImage3D(
 *    target,           // TEXTURE_2D_ARRAY
 *    level,            // mipmap level
 *  
 *    // Origin point where to upload data 
 *    xoffset,          // row where pixel data should go (kind of like padding)
 *    yoffset,          // column where pixel data should go (kind of like padding)
 *    zoffset,          // array "index" for pixels 
 *    
 *    // The data you are uploading
 *    width,            // width of pixel data
 *    height,           // height of pixel data
 *    depth,            // number of "slices" for this data
 *  
 *    format,           // data format of pixel data 
 *    type,             // datatype of pixel data 
 *    source,           // your pixel data 
 * );
 */