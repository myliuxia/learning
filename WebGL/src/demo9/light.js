// demo 变量    
let uniforms = {
  // 光源颜色
  lightColor: {
    r: 255,
    g: 255,
    b: 255
  },
  // 环境光强度
  ambientFactor: 0.2,
  // 光源坐标
  lightX: 0,
  lightY: 0,
  lightZ: 30,
  xRotation: 0,
  yRotation: 0,
  zRotation: 0,
  modelX: 0,
  modelY: 0,
  modelZ: 0,
  modelScaleY: 1,
  enableDiffuse: true,
  enableSpecial: true,
  enableBlinPhong: true,
  shiness: 32,
  eyeX: 0,
  eyeY: 0,
  eyeZ: 10
};

var Vector3 = window.lib3d.Vector3;

//获取canvas
let canvas = getCanvas('#webgl');
//设置canvas尺寸为满屏
resizeCanvas(canvas);
//获取绘图上下文
let gl = getContext(canvas);
//创建着色器程序
let program = createSimpleProgramFromScript(gl, 'vertexShader', 'fragmentShader');
//使用该着色器程序
gl.useProgram(program);


let rate = canvas.width / canvas.height;
let hori = rate;
let per = null;
per = matrix.ortho(-hori * 15, hori * 15, -15, 15, 100, -100);

//顶点信息
let sphere = createSphere(10, 12, 24); 
sphere = transformIndicesToUnIndices(sphere);
createColorForVertex(sphere);
let positions = sphere.positions;
let indices = sphere.indices;
let colors = sphere.colors;
let normals = sphere.normals;

// 获得着色器属性
let a_Position = gl.getAttribLocation(program, 'a_Position');
let a_Color = gl.getAttribLocation(program, 'a_Color');
let a_Normal = gl.getAttribLocation(program, 'a_Normal');
let u_Matrix = gl.getUniformLocation(program, 'u_Matrix');
let u_Texture = gl.getUniformLocation(program, 'u_Texture');
let u_AmbientFactor = gl.getUniformLocation(program, 'u_AmbientFactor');
let u_LightColor = gl.getUniformLocation(program, 'u_LightColor');
let u_LightPosition = gl.getUniformLocation(program, 'u_LightPosition');
let u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');
let u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
let u_LightMatrix = gl.getUniformLocation(program, 'u_LightMatrix');
let u_ViewPosition = gl.getUniformLocation(program, 'u_ViewPosition');
let enableDiffuse = gl.getUniformLocation(program, 'enableDiffuse');
let enableSpecial = gl.getUniformLocation(program, 'enableSpecial');
let enableBlinPhong = gl.getUniformLocation(program, 'enableBlinPhong');
let shiness = gl.getUniformLocation(program, 'shiness');
// 启用顶点属性
gl.enableVertexAttribArray(a_Position);
gl.enableVertexAttribArray(a_Color);
gl.enableVertexAttribArray(a_Normal);

// 计算投影矩阵
var aspect = canvas.clientWidth / canvas.clientHeight;
var fieldOfViewRadians = 60;
var projectionMatrix = matrix.perspective(
  fieldOfViewRadians,
  aspect,
  1,
  2000
);

// 计算相机在圆上的位置矩阵
var cameraPosition = new Vector3(0, 0, 6);
var target = new Vector3(0, 0, 0);
var up = new Vector3(0, 1, 0);
var cameraMatrix = matrix.lookAt(cameraPosition, target, up);
var modelMatrix = matrix.identity();

// 从相机矩阵取逆获取视图矩阵
var viewMatrix = matrix.inverse(cameraMatrix);
var viewProjectionMatrix = matrix.multiply(projectionMatrix, viewMatrix);

gl.uniformMatrix4fv(u_Matrix, false, viewProjectionMatrix);


let buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

let colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
gl.vertexAttribPointer(a_Color, 4, gl.UNSIGNED_BYTE, true, 0, 0);

let normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

//设置清屏颜色
gl.clearColor(0, 0, 0, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);



/** 设置Uniform属性 */
function setUniforms() {
  gl.uniform3f(
    u_LightColor,
    uniforms['lightColor'].r / 255,
    uniforms['lightColor'].g / 255,
    uniforms['lightColor'].b / 255
  );

  gl.uniform3f(
    u_LightPosition,
    uniforms['lightX'],
    uniforms['lightY'],
    uniforms['lightZ']
  );

  gl.uniform3f(
    u_ViewPosition,
    uniforms['eyeX'],
    uniforms['eyeY'],
    uniforms['eyeZ']
  );
  gl.uniform1f(u_AmbientFactor, uniforms['ambientFactor']);
  gl.uniform1i(enableDiffuse, uniforms['enableDiffuse']);
  gl.uniform1i(enableSpecial, uniforms['enableSpecial']);
  gl.uniform1i(enableBlinPhong, uniforms['enableBlinPhong']);
  gl.uniform1f(shiness, uniforms['shiness']);

  let modelMatrix = matrix.identity();
  modelMatrix = matrix.translate(modelMatrix, uniforms['modelX'], 0, 0);
  modelMatrix = matrix.translate(modelMatrix, 0, uniforms['modelY'], 0);
  modelMatrix = matrix.translate(modelMatrix, 0, 0, uniforms['modelZ']);

  modelMatrix = matrix.rotateY(
    modelMatrix,
    (Math.PI / 180) * uniforms['yRotation']
  );
  modelMatrix = matrix.rotateX(
    modelMatrix,
    (Math.PI / 180) * uniforms['xRotation']
  );
  modelMatrix = matrix.rotateZ(
    modelMatrix,
    (Math.PI / 180) * uniforms['zRotation']
  );
  modelMatrix = matrix.multiply(
    modelMatrix,
    matrix.scalation(1, uniforms['modelScaleY'], 1)
  );

  gl.uniformMatrix4fv(
    u_NormalMatrix,
    false,
    matrix.transpose(matrix.inverse(modelMatrix))
  );
 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);

  cameraMatrix = matrix.lookAt(
    new Vector3(uniforms['eyeX'], uniforms['eyeY'], uniforms['eyeZ']),
    target,
    up
  );
  viewMatrix = matrix.inverse(cameraMatrix);

  
  gl.uniformMatrix4fv(
    u_Matrix,
    false,
    matrix.multiply(per, matrix.multiply(viewMatrix, modelMatrix))
  );
}


function render() {
  //用上一步设置的清空画布颜色清空画布。
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  if (positions.length <= 0) {
    return;
  }
  if (uniforms.xRotation == 360) {
    uniforms.xRotation = 0;
  }
  uniforms.xRotation += 1;
  setUniforms();
  //绘制图元设置为三角形。
  let primitiveType = gl.TRIANGLES;
  gl.drawArrays(primitiveType, 0, positions.length / 3);
  if(!playing){
      return;
  }
  requestAnimationFrame(render);
}  
var playing = false
document.body.addEventListener('click',function(){
  playing = !playing;
  render();  
})


setUniforms();
render();

