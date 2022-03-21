绘制三角形：学会使用缓冲区、了解 WebGL 中的基本图形元素

- Triangles.html：绘制一个三角形
- index.html: 利用鼠标动态绘制三角形的功能

主要涉及内容：

- 三角形图元分类
  - gl.TRIANGLES：基本三角形
  - gl.TRIANGLE_STRIP：三角带
  - gl.TRIANGLE_FAN：三角扇
- 类型化数组的作用
  - Float32Array：32位浮点数组
- 使用缓冲区传递数据
  - gl.createBuffer：创建buffer
  - gl.bindBuffer：绑定某个缓冲区对象为当前缓冲区
  - gl.bufferData：往缓冲区中复制数据
  - gl.enableVertexAttribArray：启用顶点属性
  - gl.vertexAttribPointer：设置顶点属性从缓冲区中读取数据的方式
- 动态绘制三角形
  - 改变顶点信息，然后通过缓冲区将改变后的顶点信息传递到着色器，重新绘制三角形