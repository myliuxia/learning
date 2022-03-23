/**
 * 通过绘制一个点来演示WebGL程序的过程
 */
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


let cube = createCube(2, 2, 2);
// 将带索引的立方体顶点数据转化成无索引的顶点数据
cube = transformIndicesToUnIndices(cube);
// 为顶点数据添加颜色信息
createColorForVertex(cube);
let sphere = createSphere(1, 10, 10);
// 将带索引的球体顶点数据转化成无索引的顶点数据
sphere = transformIndicesToUnIndices(sphere);
// 为顶点数据添加颜色信息
createColorForVertex(sphere);

// 生成立方体的顶点缓冲对象
let cubeBufferInfo = createBufferInfoFromObject(gl, cube);
// 生成球体的顶点缓冲对象
let sphereBufferInfo = createBufferInfoFromObject(gl, sphere);


// 渲染列表
let renderList = new List();
// 模型列表
let modelList = new List();

for (var i = 0; i < 100; ++i) {
    var object = new Model();
    if (i % 2 == 0) {
        object.setBufferInfo(cubeBufferInfo);
    } else {
        object.setBufferInfo(sphereBufferInfo);
    }
    // 设置模型的位置
    object.translate(rand(-10, 10), rand(-10, 10), rand(-10, 10));
    // 设置模型的旋转角度
    object.rotate(rand(0, 90));
    // 预渲染
    object.preRender(viewMatrix, projectionMatrix);
    // 设置模型的 uniforms 属性。
    object.setUniforms({
        u_ModelMatrix: object.u_ModelMatrix,
        u_Matrix: object.u_Matrix,
        u_ColorFactor: new Float32Array([rand(0.5, 0.75), rand(0.5, 0.75), rand(0.25, 0.5)])
    })

    objectList.add(object);
    // 根据模型对象创建渲染对象，并将渲染对象添加到渲染列表中
    renderList.add({
        programInfo: program,
        model: object,
        primitive: gl.TRIANGLES,
        renderType: 'drawArrays'
    });
}


// 全局变量
var playing = false;
var rand = lib3d.math.rand

/** 渲染方法 */
function render() {
  if (!playing) {
      requestAnimationFrame(render);
      return;
  }
  // 重新设置模型的状态
  objectList.forEach(function (object) {
      object.rotateX(object.rotation[0] + rand(0.2, 0.5));
      object.rotateY(object.rotation[1] + rand(0.2, 0.5));
      object.rotateZ(object.rotation[1] + rand(0.2, 0.5));
      object.preRender(viewMatrix, projectionMatrix);
      object.setUniforms({
          u_ModelMatrix: object.u_ModelMatrix,
          u_Matrix: object.u_Matrix,
      })
  })
  // 执行渲染
  let lastProgram;
  let lastBufferInfo;
  renderList.forEach(function (object) {
      let programInfo = object.programInfo;
      let bufferInfo = object.model.bufferInfo;
      let uniforms = object.model.uniforms;
      let bindBuffers = false;
      if (programInfo !== lastProgram) {
        lastProgram = programInfo;
        gl.useProgram(programInfo.program);
        bindBuffers = true;
      }

      if (bindBuffers || bufferInfo !== lastBufferInfo) {
        lastBufferInfo = bufferInfo;
        setBufferInfos(gl, programInfo, bufferInfo);
      }
      setUniforms(programInfo, uniforms);

      // 绘制
      if (object.renderType === 'drawElements') {
        if (bufferInfo.indices) {
          gl.drawElements(object.primitive, bufferInfo.indices.length, gl.UNSIGNED_SHORT, 0);
          return;
        } else {
          console.warn('model buffer does not support indices to draw');
          return;
        }
      } else {
        gl.drawArrays(gl[object.primitive], 0, bufferInfo.elementsCount);
      }
    });
    requestAnimationFrame(render);
  }

  document.body.addEventListener('click',function(){
    playing = !playing;
    render();  
  })
  render();